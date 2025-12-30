(function(wp) {
    const { registerPlugin } = wp.plugins;
    const { PluginDocumentSettingPanel } = wp.editPost;
    const { Button, Spinner, Notice, Modal } = wp.components;
    const { useState } = wp.element;
    const { useSelect } = wp.data;
    const { __ } = wp.i18n;

    function MiraVerifyPanel() {
        const [isVerifying, setIsVerifying] = useState(false);
        const [results, setResults] = useState(null);
        const [error, setError] = useState(null);
        const [progress, setProgress] = useState(null);
        const [isModalOpen, setIsModalOpen] = useState(false);
        const [historyId, setHistoryId] = useState(null);

        const { content, postId, postTitle } = useSelect(function(select) {
            const editor = select('core/editor');
            return {
                content: editor.getEditedPostContent(),
                postId: editor.getCurrentPostId(),
                postTitle: editor.getEditedPostAttribute('title'),
            };
        });

        const handleVerify = function() {
            if (!content || content.trim().length < 10) {
                setError(__('Content is too short to verify.', 'mira-verify'));
                return;
            }

            setIsVerifying(true);
            setError(null);
            setResults(null);
            setHistoryId(null);
            setProgress({ message: __('Preparing verification...', 'mira-verify') });

            // Build form data for WordPress AJAX
            var formData = new FormData();
            formData.append('action', 'mira_verify_content');
            formData.append('nonce', miraVerify.nonce);
            formData.append('content', content);
            formData.append('post_id', postId);
            formData.append('post_title', postTitle);

            // Call WordPress AJAX which now proxies the SSE stream
            // Token stays server-side, never exposed to JavaScript
            fetch(miraVerify.ajaxUrl, {
                method: 'POST',
                body: formData,
            })
            .then(function(response) {
                if (!response.ok) {
                    throw new Error(__('Verification failed', 'mira-verify'));
                }

                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let buffer = '';

                function processStream() {
                    return reader.read().then(function(result) {
                        if (result.done) {
                            setIsVerifying(false);
                            setProgress(null);
                            return;
                        }

                        buffer += decoder.decode(result.value, { stream: true });
                        const lines = buffer.split('\n');
                        buffer = lines.pop() || '';

                        lines.forEach(function(line) {
                            line = line.trim();
                            if (line.startsWith('data: ')) {
                                var jsonStr = line.substring(6);
                                if (jsonStr && jsonStr.startsWith('{')) {
                                    try {
                                        var eventData = JSON.parse(jsonStr);
                                        handleSSEEvent(eventData);
                                    } catch (e) {
                                        console.warn('Mira Verify: Failed to parse SSE event:', e.message);
                                    }
                                }
                            }
                        });

                        return processStream();
                    });
                }

                return processStream();
            })
            .catch(function(err) {
                setError(err.message);
                setIsVerifying(false);
                setProgress(null);
            });
        };

        const handleSSEEvent = function(event) {
            const eventType = event.type;
            const data = event.data || {};

            switch (eventType) {
                case 'init':
                    if (data.historyId) {
                        setHistoryId(data.historyId);
                    }
                    break;

                case 'starting':
                    setProgress({ message: __('Starting verification...', 'mira-verify') });
                    break;

                case 'extracting_claims':
                    setProgress({ message: __('Extracting claims...', 'mira-verify') });
                    break;

                case 'claims_extracted':
                    var claimCount = data.questionCount || data.count || 0;
                    setProgress({
                        message: claimCount + ' ' + (claimCount === 1 ? __('claim found', 'mira-verify') : __('claims found', 'mira-verify'))
                    });
                    break;

                case 'verifying_claims':
                    setProgress({ message: __('Verifying with AI models...', 'mira-verify') });
                    break;

                case 'verifying_claim':
                    setProgress({
                        message: __('Verifying:', 'mira-verify') + ' ' + (data.claim ? data.claim.substring(0, 40) + '...' : '')
                    });
                    break;

                case 'claim_verified':
                    setResults(function(prev) {
                        const newResults = prev ? [...prev] : [];
                        newResults.push({
                            claim: data.claim,
                            assessment: data.assessment,
                            models: data.model_answers || []
                        });
                        return newResults;
                    });
                    break;

                case 'completed':
                    setIsVerifying(false);
                    setProgress(null);
                    if (data.results) {
                        setResults(data.results.map(function(r) {
                            return {
                                claim: r.claim,
                                assessment: r.assessment,
                                models: r.model_answers || []
                            };
                        }));
                    }
                    break;

                case 'error':
                    setError(data.message || event.message || __('An error occurred', 'mira-verify'));
                    setIsVerifying(false);
                    setProgress(null);
                    break;
            }
        };

        const getCounts = function() {
            if (!results) return { true: 0, false: 0, noConsensus: 0 };
            return results.reduce(function(acc, r) {
                if (r.assessment === 'TRUE') acc.true++;
                else if (r.assessment === 'FALSE') acc.false++;
                else acc.noConsensus++;
                return acc;
            }, { true: 0, false: 0, noConsensus: 0 });
        };

        const getAssessmentClass = function(assessment) {
            switch (assessment) {
                case 'TRUE': return 'mira-verify-true';
                case 'FALSE': return 'mira-verify-false';
                default: return 'mira-verify-no-consensus';
            }
        };

        const getAssessmentLabel = function(assessment) {
            switch (assessment) {
                case 'TRUE': return __('True', 'mira-verify');
                case 'FALSE': return __('False', 'mira-verify');
                default: return __('Uncertain', 'mira-verify');
            }
        };

        const counts = getCounts();

        // Build modal content
        var modalContent = [];

        // Summary bar
        modalContent.push(
            wp.element.createElement(
                'div',
                { key: 'summary', className: 'mira-verify-modal-summary' },
                wp.element.createElement('span', { className: 'mira-verify-count mira-verify-count-true' }, '✓ ' + counts.true + ' True'),
                wp.element.createElement('span', { className: 'mira-verify-count mira-verify-count-false' }, '✗ ' + counts.false + ' False'),
                counts.noConsensus > 0 && wp.element.createElement('span', { className: 'mira-verify-count mira-verify-count-no-consensus' }, '? ' + counts.noConsensus + ' Uncertain')
            )
        );

        // Results list
        modalContent.push(
            wp.element.createElement(
                'div',
                { key: 'results', className: 'mira-verify-modal-results' },
                results && results.map(function(result, index) {
                    return wp.element.createElement(
                        'div',
                        { key: index, className: 'mira-verify-result ' + getAssessmentClass(result.assessment) },
                        wp.element.createElement(
                            'div',
                            { className: 'mira-verify-result-header' },
                            wp.element.createElement('span', { className: 'mira-verify-result-number' }, 'Claim ' + (index + 1)),
                            wp.element.createElement('span', { className: 'mira-verify-assessment' }, getAssessmentLabel(result.assessment))
                        ),
                        wp.element.createElement('div', { className: 'mira-verify-claim' }, result.claim),
                        result.models && result.models.length > 0 && wp.element.createElement(
                            'div',
                            { className: 'mira-verify-models' },
                            result.models.map(function(m, i) {
                                var modelName = m.model.split('/').pop();
                                var isTrue = m.answer === 'A';
                                return wp.element.createElement(
                                    'span',
                                    { key: i, className: 'mira-verify-model ' + (isTrue ? 'mira-verify-model-true' : 'mira-verify-model-false') },
                                    modelName + ' ' + (isTrue ? '✓' : '✗')
                                );
                            })
                        )
                    );
                })
            )
        );

        // Footer with dashboard link
        var dashboardLink = historyId
            ? miraVerify.dashboardUrl + '/dashboard/verification/' + historyId
            : miraVerify.dashboardUrl + '/dashboard/usage';

        modalContent.push(
            wp.element.createElement(
                'div',
                { key: 'footer', className: 'mira-verify-modal-footer' },
                wp.element.createElement(
                    'a',
                    {
                        href: dashboardLink,
                        target: '_blank',
                        rel: 'noopener noreferrer',
                        className: 'mira-verify-dashboard-link'
                    },
                    historyId ? __('View in dashboard', 'mira-verify') : __('View all verifications', 'mira-verify'),
                    ' →'
                ),
                wp.element.createElement(
                    Button,
                    { variant: 'primary', onClick: function() { setIsModalOpen(false); } },
                    __('Close', 'mira-verify')
                )
            )
        );

        return wp.element.createElement(
            PluginDocumentSettingPanel,
            {
                name: 'mira-verify-panel',
                title: __('Mira Verify', 'mira-verify'),
                className: 'mira-verify-panel',
            },
            [
                // Error notice
                error && wp.element.createElement(
                    Notice,
                    { key: 'error', status: 'error', isDismissible: true, onRemove: function() { setError(null); } },
                    error
                ),

                // Progress indicator
                progress && wp.element.createElement(
                    'div',
                    { key: 'progress', className: 'mira-verify-progress' },
                    wp.element.createElement(Spinner, null),
                    wp.element.createElement('span', null, progress.message)
                ),

                // Verify button
                !isVerifying && wp.element.createElement(
                    Button,
                    {
                        key: 'button',
                        variant: 'primary',
                        onClick: handleVerify,
                        disabled: !content || content.trim().length < 10,
                        className: 'mira-verify-button',
                    },
                    results ? __('Verify Again', 'mira-verify') : __('Verify Content', 'mira-verify')
                ),

                // Results summary
                results && results.length > 0 && wp.element.createElement(
                    'div',
                    { key: 'summary', className: 'mira-verify-summary' },
                    wp.element.createElement(
                        'div',
                        { className: 'mira-verify-summary-counts' },
                        wp.element.createElement('span', { className: 'mira-verify-count mira-verify-count-true' }, '✓ ' + counts.true),
                        wp.element.createElement('span', { className: 'mira-verify-count mira-verify-count-false' }, '✗ ' + counts.false),
                        counts.noConsensus > 0 && wp.element.createElement('span', { className: 'mira-verify-count mira-verify-count-no-consensus' }, '? ' + counts.noConsensus)
                    ),
                    wp.element.createElement(
                        Button,
                        { variant: 'secondary', onClick: function() { setIsModalOpen(true); }, className: 'mira-verify-details-button' },
                        __('View Details', 'mira-verify')
                    )
                ),

                // No claims message
                results && results.length === 0 && wp.element.createElement(
                    'p',
                    { key: 'no-claims', className: 'mira-verify-no-claims' },
                    __('No verifiable claims found.', 'mira-verify')
                ),

                // Results Modal
                isModalOpen && wp.element.createElement(
                    Modal,
                    {
                        key: 'modal',
                        title: __('Verification Results', 'mira-verify'),
                        onRequestClose: function() { setIsModalOpen(false); },
                        className: 'mira-verify-modal',
                        isDismissible: true,
                    },
                    modalContent
                )
            ]
        );
    }

    registerPlugin('mira-verify', {
        render: MiraVerifyPanel,
        icon: 'yes-alt',
    });

})(window.wp);
