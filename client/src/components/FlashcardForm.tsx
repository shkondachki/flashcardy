import { useState, useEffect, useRef } from 'react';
import { Flashcard, Tech, Difficulty } from '../types';
import { TECH_OPTIONS, DIFFICULTY_OPTIONS } from '../constants';
import styles from './FlashcardForm.module.scss';

interface FlashcardFormProps {
  flashcard?: Flashcard;
  onSubmit: (data: FlashcardFormData) => Promise<void>;
  onCancel: () => void;
}

export interface FlashcardFormData {
  question: string;
  answer: string;
  tech: Tech;
  categories: string[];
  difficulty?: Difficulty;
}

// Internal form state (allows empty strings for validation)
interface FormState {
  question: string;
  answer: string;
  tech: Tech | '';
  categories: string[];
  difficulty: Difficulty | '';
}

const initialFormData: FormState = {
  question: '',
  answer: '',
  tech: '',
  categories: [],
  difficulty: 'easy',
};

export function FlashcardForm({ flashcard, onSubmit, onCancel }: FlashcardFormProps) {
  const [formData, setFormData] = useState<FormState>(initialFormData);
  const [categoryInput, setCategoryInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const questionTextareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (flashcard) {
      setFormData({
        question: flashcard.question,
        answer: flashcard.answer,
        tech: flashcard.tech,
        categories: [...flashcard.categories],
        difficulty: flashcard.difficulty || 'easy',
      });
    } else {
      setFormData(initialFormData);
    }
    setCategoryInput('');
    setErrors({});
  }, [flashcard]);

  // Close form on Escape key
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onCancel();
      }
    }

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onCancel]);

  // Auto-focus question field when creating a new flashcard
  useEffect(() => {
    if (!flashcard && questionTextareaRef.current) {
      // Use setTimeout to ensure the DOM is fully rendered
      const timer = setTimeout(() => {
        questionTextareaRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [flashcard]);

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (!formData.question.trim()) {
      newErrors.question = 'Question is required';
    }

    if (!formData.answer.trim()) {
      newErrors.answer = 'Answer is required';
    }

    if (!formData.tech) {
      newErrors.tech = 'Technology is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Submit with validated data (tech and required fields are guaranteed at this point)
      await onSubmit({
        question: formData.question,
        answer: formData.answer,
        tech: formData.tech as Tech, // Safe after validation
        categories: formData.categories,
        difficulty: formData.difficulty as Difficulty, // Always has a value (defaults to 'easy')
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: error instanceof Error ? error.message : 'Failed to save flashcard' });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleAddCategory() {
    const trimmed = categoryInput.trim();
    if (trimmed && !formData.categories.includes(trimmed)) {
      setFormData({
        ...formData,
        categories: [...formData.categories, trimmed],
      });
      setCategoryInput('');
    }
  }

  function handleRemoveCategory(category: string) {
    setFormData({
      ...formData,
      categories: formData.categories.filter((c) => c !== category),
    });
  }

  function handleCategoryInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCategory();
    }
  }


  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <h2>{flashcard ? 'Edit Flashcard' : 'Create New Flashcard'}</h2>

        <form onSubmit={handleSubmit} className="form">
          <div className="formGroup">
            <label htmlFor="question">
              Question <span className="required">*</span>
            </label>
            <textarea
              ref={questionTextareaRef}
              id="question"
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              rows={1}
              className={errors.question ? styles.error : ''}
            />
            {errors.question && <span className="errorMessage">{errors.question}</span>}
          </div>

          <div className="formGroup">
            <label htmlFor="answer">
              Answer <span className="required">*</span>
            </label>
            <textarea
              id="answer"
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              rows={3}
              className={errors.answer ? styles.error : ''}
            />
            {errors.answer && <span className="errorMessage">{errors.answer}</span>}
            <small className="formHint">Markdown is supported (e.g., **bold**, `code`, ```code blocks```)</small>
          </div>

          <div className="formRow">
            <div className="formGroup">
              <label htmlFor="tech">
                Technology <span className="required">*</span>
              </label>
              <select
                id="tech"
                value={formData.tech}
                onChange={(e) => setFormData({ ...formData, tech: e.target.value as Tech | '' })}
                className={errors.tech ? styles.error : ''}
              >
                <option value="">Select...</option>
                {TECH_OPTIONS.map((tech) => (
                  <option key={tech} value={tech}>
                    {tech}
                  </option>
                ))}
              </select>
              {errors.tech && <span className="errorMessage">{errors.tech}</span>}
            </div>

            <div className="formGroup">
              <label htmlFor="difficulty">Difficulty</label>
              <select
                id="difficulty"
                value={formData.difficulty}
                onChange={(e) =>
                  setFormData({ ...formData, difficulty: e.target.value as Difficulty | '' })
                }
              >
                {/*<option value="">None</option>*/}
                {DIFFICULTY_OPTIONS.map((diff) => (
                  <option key={diff} value={diff}>
                    {diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="formGroup">
            <label htmlFor="categories">Tags</label>
            <div className={styles.categoryInputGroup}>
              <input
                id="categories"
                type="text"
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                onKeyDown={handleCategoryInputKeyDown}
                placeholder="Add tags here..."
              />
              <button type="button" onClick={handleAddCategory} className="btn-secondary btn-squircle">
                Add
              </button>
            </div>
            {formData.categories.length > 0 && (
              <div className={styles.categoriesList}>
                {formData.categories.map((category, index) => (
                  <span key={index} className={styles.categoryTag}>
                    {category}
                    <button
                      type="button"
                      onClick={() => handleRemoveCategory(category)}
                      className={styles.removeCategory}
                      aria-label={`Remove ${category}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {errors.submit && <div className={`errorMessage alert ${styles.submitError}`}>{errors.submit}</div>}

          <div className="formActions">
            <button type="button" onClick={onCancel} disabled={isSubmitting} className="btn-outline-primary  full-width">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn-primary  full-width">
              {isSubmitting ? 'Saving...' : flashcard ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
