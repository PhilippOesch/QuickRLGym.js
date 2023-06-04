/**
 * Interface for implementing equality check of a Type
 * @category Utils
 */
interface Comparable<T> {
    /**
     * Check if object is equal to other object
     * @param {T} comp object to compare to
     * @returns {boolean} Whether the compared object is of equal value
     */
    isEqual(comp: T): boolean;
}

export default Comparable;
