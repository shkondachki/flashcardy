import {useState, useEffect, useRef, useMemo} from 'react';
import {getFlashcards, createFlashcard, updateFlashcard, deleteFlashcard} from '../api/flashcards';
import {Flashcard, FlashcardFilters} from '../types';
import {FlashcardCard} from '../components/FlashcardCard';
import {SearchAndFilters} from '../components/SearchAndFilters';
import {FlashcardForm, FlashcardFormData} from '../components/FlashcardForm';
import {useApp} from '../context/AppContext';
import styles from './FlashcardsList.module.scss';

interface FlashcardsListProps {
    filters: FlashcardFilters;
    setFilters: (filters: FlashcardFilters) => void;
    isAuthenticated: boolean;
}

// Used for pagination
const ITEMS_PER_PAGE = 3;

export function FlashcardsList({
   filters,
   setFilters,
   isAuthenticated
}: FlashcardsListProps) {
    const {showCreateForm, setShowCreateForm} = useApp();
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [editingFlashcard, setEditingFlashcard] = useState<Flashcard | undefined>(undefined);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const observerTarget = useRef<HTMLDivElement>(null);

    // Use useMemo to calculate available categories safely
    const availableCategories = useMemo(() => {
        return Array.from(
            new Set(flashcards.flatMap((card) => card.categories))
        ).sort();
    }, [flashcards]);

    // Reset when filters change
    useEffect(() => {
        setPage(1);
        setHasMore(true);
        // Don't clear flashcards here - let loadFlashcards handle it to prevent flicker
        loadFlashcards(1, true);
    }, [filters]);


    // Infinite scroll observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
                    setPage((prev) => prev + 1);
                }
            },
            {threshold: 0.1}
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [hasMore, loading, loadingMore]);

    // Load more when page changes
    useEffect(() => {
        if (page > 1) {
            loadFlashcards(page, false);
        }
    }, [page]);

    async function loadFlashcards(pageNum: number, reset: boolean = false) {
        try {
            if (reset) {
                setLoading(true);
                // Clear flashcards only when starting to load new data, not before
                // This keeps the old content visible until new data arrives
            } else {
                setLoadingMore(true);
            }
            setError(null);

            const data = await getFlashcards(filters, pageNum, ITEMS_PER_PAGE);

            // When resetting, replace the entire array with new data
            // This happens after the fetch completes, preventing flicker
            setFlashcards((prev) => reset ? data.flashcards : [...prev, ...data.flashcards]);
            setHasMore(data.hasMore);
            setTotalCount(data.totalCount);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load flashcards');
            console.error('Error loading flashcards:', err);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }

    async function handleCreate(data: FlashcardFormData) {
        try {
            await createFlashcard({
                question: data.question,
                answer: data.answer,
                tech: data.tech,
                categories: data.categories,
                difficulty: data.difficulty,
            });
            setShowCreateForm(false);
            setPage(1);
            setFlashcards([]);
            setHasMore(true);
            await loadFlashcards(1, true);
        } catch (err) {
            throw err;
        }
    }

    async function handleUpdate(data: FlashcardFormData) {
        if (!editingFlashcard) return;

        try {
            await updateFlashcard(editingFlashcard.id, {
                question: data.question,
                answer: data.answer,
                tech: data.tech,
                categories: data.categories,
                difficulty: data.difficulty,
            });
            setEditingFlashcard(undefined);
            setPage(1);
            setFlashcards([]);
            setHasMore(true);
            await loadFlashcards(1, true);
        } catch (err) {
            throw err;
        }
    }

    async function handleDelete(id: string) {
        try {
            await deleteFlashcard(id);
            setPage(1);
            setFlashcards([]);
            setHasMore(true);
            await loadFlashcards(1, true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete flashcard');
            console.error('Error deleting flashcard:', err);
        }
    }

    function handleEdit(flashcard: Flashcard) {
        setEditingFlashcard(flashcard);
        setShowCreateForm(false);
    }

    function handleFormCancel() {
        setShowCreateForm(false);
        setEditingFlashcard(undefined);
    }

    if (loading && flashcards.length === 0) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>Loading flashcards...</div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <SearchAndFilters
                filters={filters}
                onFiltersChange={setFilters}
                availableCategories={availableCategories}
            />

            {error && <div className="errorMessage alert">Error: {error}</div>}

            {flashcards.length === 0 ? (
                <div className={styles.emptyState}>
                    {filters.tech || filters.category || filters.search
                        ? 'No flashcards match your filters.'
                        : 'No flashcards yet. Create one to get started!'}
                </div>
            ) : (
                <>
                    <div className={styles.flashcardsCount}>
                        Showing {flashcards.length} out of {totalCount} flashcard{totalCount !== 1 ? 's' : ''}
                    </div>
                    <div className={styles.flashcardsGrid}>
                        {flashcards.map((flashcard) => (
                            <FlashcardCard
                                key={flashcard.id}
                                flashcard={flashcard}
                                onEdit={isAuthenticated ? handleEdit : undefined}
                                onDelete={isAuthenticated ? handleDelete : undefined}
                                isAuthenticated={isAuthenticated}
                            />
                        ))}
                    </div>

                    {hasMore && (
                        <div ref={observerTarget} className={styles.loadingTrigger}>
                            {loadingMore && <div className={styles.loadingMore}>Loading more...</div>}
                        </div>
                    )}
                </>
            )}

            {(showCreateForm || editingFlashcard) && (
                <FlashcardForm
                    flashcard={editingFlashcard}
                    onSubmit={editingFlashcard ? handleUpdate : handleCreate}
                    onCancel={handleFormCancel}
                />
            )}
        </div>
    );
}