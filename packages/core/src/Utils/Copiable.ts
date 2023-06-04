/**
 * Interface for creating a deep copy of an object
 * @category Utils
 */
interface Copiable<T> {
    /**
     * Copy the object
     * @returns {T} a copy
     */
    copy(): T;
}

export default Copiable;
