import {Flashcard} from '../types';
import {MarkdownRenderer} from './MarkdownRenderer';
import styles from './FlashcardCard.module.scss';
import {useState, useEffect} from "react";
import { Pencil, X } from 'lucide-react';

interface FlashcardCardProps {
    flashcard: Flashcard;
    onEdit?: (flashcard: Flashcard) => void;
    onDelete?: (id: string) => void;
    studyMode?: boolean;
    showAnswer?: boolean;
    onToggleAnswer?: () => void;
    isAuthenticated?: boolean
}

export function FlashcardCard({
  flashcard,
  onEdit,
  onDelete,
  studyMode = false,
  showAnswer: controlledShowAnswer,
  onToggleAnswer,
  isAuthenticated = false
}: FlashcardCardProps) {
    // Internal state for list view (uncontrolled)
    const [internalShowAnswer, setInternalShowAnswer] = useState(true);

    // Use controlled value in study mode, internal state in list view
    const showAnswer = studyMode && controlledShowAnswer !== undefined
        ? controlledShowAnswer
        : internalShowAnswer;

    // Reset internal state when card changes in study mode
    useEffect(() => {
        if (studyMode && controlledShowAnswer !== undefined) {
            setInternalShowAnswer(controlledShowAnswer);
        }
    }, [studyMode, controlledShowAnswer]);

    function handleToggleAnswer() {
        if (studyMode && onToggleAnswer) {
            onToggleAnswer();
        } else {
            setInternalShowAnswer(!internalShowAnswer);
        }
    }

    function handleDelete() {
        if (window.confirm('Are you sure you want to delete this flashcard?')) {
            if (onDelete) {
                onDelete(flashcard.id);
            }
        }
    }

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div className={styles.badges}>
                    <span className={`${styles.tech} ${styles[(flashcard.tech).toLowerCase()]}`}>
                        {flashcard.tech}
                    </span>

                    {flashcard.difficulty && (
                        <span className={`${styles.difficulty} ${styles[flashcard.difficulty]}`}>
                            {flashcard.difficulty}
                        </span>
                    )}
                </div>

                {!studyMode && isAuthenticated && <div className={styles.actions}>
                    <div
                        onClick={() => onEdit ? onEdit(flashcard) : ""}
                        className={`${styles.actionBtn} ${styles.edit}`}
                        aria-label="Edit flashcard"
                    >
                        <Pencil />

                    </div>
                    <div
                        onClick={handleDelete}
                        className={`${styles.actionBtn} ${styles.delete}`}
                        aria-label="Delete flashcard"
                    >
                        <X />
                    </div>
                </div>}
            </div>

            <div className={styles.content}>
                <h3 className={styles.question}>
                    <MarkdownRenderer content={flashcard.question}/>
                </h3>
                {showAnswer && <div className={styles.answer}>
                    <MarkdownRenderer content={flashcard.answer}/>
                </div>}
            </div>

            {flashcard.categories.length > 0 && (
                <div className={styles.categories}>
                    {flashcard.categories.map((category, index) => (
                        <span key={index} className={styles.categoryTag}>
                            {category}
                        </span>
                    ))}
                </div>
            )}

            {/* Show only if in Study Mode */}
            {studyMode && <div className={styles.studyActions}>
                <button
                    onClick={handleToggleAnswer}
                    className="btn-outline-primary"
                >
                    {showAnswer ? 'Hide Answer' : 'Show Answer'}
                </button>
            </div>}
        </div>
    );
}