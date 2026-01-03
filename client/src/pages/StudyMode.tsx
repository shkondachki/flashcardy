import {useState, useEffect, useCallback} from 'react';
import {getFlashcards} from '../api/flashcards';
import {Flashcard, FlashcardFilters, Tech} from '../types';
import {TECH_OPTIONS, STUDY_MODE_MAX_CARDS} from '../constants';
import styles from './StudyMode.module.scss';
import {FlashcardCard} from "../components/FlashcardCard.tsx";
import {Preloader} from "../components/Preloader.tsx";

interface StudyModeProps {
    onBack: () => void;
}

export function StudyMode({onBack}: StudyModeProps) {
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [filters, setFilters] = useState<FlashcardFilters>({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch flashcards when filters change
    useEffect(() => {
        loadFlashcards();
    }, [filters]);

    // Reset to first card when flashcards change
    useEffect(() => {
        if (flashcards.length > 0) {
            setCurrentIndex(0);
            setShowAnswer(false);
        }
    }, [flashcards]);

    async function loadFlashcards() {
        try {
            setLoading(true);
            setError(null);
            // Fetch flashcards for Study Mode (needs all cards in memory for navigation/random)
            // Using a reasonable limit that should cover most portfolio use cases
            const data = await getFlashcards(filters, 1, STUDY_MODE_MAX_CARDS);
            setFlashcards(data.flashcards);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load flashcards');
            console.error('Error loading flashcards:', err);
        } finally {
            setLoading(false);
        }
    }

    const handleTechChange = (tech: Tech | '') => {
        setFilters({
            tech: tech || undefined
        });
    };

    const handleRandom = useCallback(() => {
        if (flashcards.length === 0) return;
        const randomIdx = Math.floor(Math.random() * flashcards.length);
        setCurrentIndex(randomIdx);
        setShowAnswer(false);
    }, [flashcards.length]);

    const handleNext = useCallback(() => {
        if (flashcards.length === 0) return;
        setCurrentIndex((prev) => (prev + 1) % flashcards.length);
        setShowAnswer(false);
    }, [flashcards.length]);

    const handlePrevious = useCallback(() => {
        if (flashcards.length === 0) return;
        setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
        setShowAnswer(false);
    }, [flashcards.length]);

    // Keyboard shortcuts for better UX
    useEffect(() => {
        function handleKeyPress(e: KeyboardEvent) {
            // Don't interfere with typing in inputs or selects
            if (
                e.target instanceof HTMLInputElement ||
                e.target instanceof HTMLTextAreaElement ||
                e.target instanceof HTMLButtonElement ||
                e.target instanceof HTMLSelectElement
            ) {
                return;
            }

            switch (e.key) {
                case 'ArrowRight':
                case ' ':
                    e.preventDefault();
                    handleNext();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    handlePrevious();
                    break;
                case 'r':
                case 'R':
                    e.preventDefault();
                    handleRandom();
                    break;
                case 'Enter':
                case 'a':
                case 'A':
                    e.preventDefault();
                    setShowAnswer((prev) => !prev);
                    break;
                case 'Escape':
                    e.preventDefault();
                    onBack();
                    break;
            }
        }

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [handleNext, handlePrevious, handleRandom, onBack]);

    if (loading) {
        return (
            <div className={styles.container}>
                <Preloader />
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className="errorMessage alert">Error: {error}</div>
                <button onClick={onBack} className="btn-secondary">
                    Back to List
                </button>
            </div>
        );
    }

    const currentCard = flashcards[currentIndex];
    const isEmpty = flashcards.length === 0;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button onClick={onBack} className="btn-outline-secondary">
                    ← Back to List
                </button>

                <div className="filterGroup">
                    <select
                        id="study-tech-filter"
                        value={filters.tech || ''}
                        onChange={(e) => handleTechChange(e.target.value as Tech | '')}
                        className={styles.filterSelect}
                    >
                        <option value="">All Technologies</option>
                        {TECH_OPTIONS.map((tech) => (
                            <option key={tech} value={tech}>
                                {tech}
                            </option>
                        ))}
                    </select>
                </div>

                {!isEmpty ? (
                    <div className={styles.cardCounter}>
                        Card {currentIndex + 1} of {flashcards.length}
                    </div>
                ) :
                    (
                        <div className={styles.cardCounter}>
                            No Cards found.
                        </div>
                    )}
            </div>

            {isEmpty ? (
                <div className={styles.emptyState}>
                    <p>No flashcards available with current filters.</p>
                    <button onClick={onBack} className="btn-secondary">
                        Back to List
                    </button>
                </div>
            ) : (
                <>
                    <div className={styles.studyCard}>
                        <FlashcardCard
                            flashcard={currentCard}
                            studyMode={true}
                            showAnswer={showAnswer}
                            onToggleAnswer={() => setShowAnswer(!showAnswer)}
                            isAuthenticated={false}
                        />
                    </div>

                    <div className={styles.navigationControls}>
                        <button onClick={handlePrevious} className="btn-outline-secondary" disabled={flashcards.length <= 1}>
                            ← Previous
                        </button>
                        <button onClick={handleRandom} className="btn-primary">
                            Random
                        </button>
                        <button onClick={handleNext} className="btn-outline-secondary" disabled={flashcards.length <= 1}>
                            Next →
                        </button>
                    </div>

                    <div className={styles.keyboardHints}>
                        <div className={styles.hintItem}>
                            <kbd>Space</kbd> or <kbd>→</kbd> Next
                        </div>
                        <div className={styles.hintItem}>
                            <kbd>←</kbd> Previous
                        </div>
                        <div className={styles.hintItem}>
                            <kbd>R</kbd> Random
                        </div>
                        <div className={styles.hintItem}>
                            <kbd>Enter</kbd> or <kbd>A</kbd> Toggle Answer
                        </div>
                        <div className={styles.hintItem}>
                            <kbd>Esc</kbd> Back
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
