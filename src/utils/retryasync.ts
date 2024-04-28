/**
 * Retries an asynchronous function a specified number of times.
 * @param asyncFn The asynchronous function to retry.
 * @param retries Number of times to retry before throwing the last error.
 * @param delay Optional delay between retries in milliseconds.
 * @returns A Promise with the result of `asyncFn` if it succeeds within the retries.
 */
async function retryAsync<T>(asyncFn: () => Promise<T>, retries: number, delay?: number): Promise<T> {
    try {
        return await asyncFn(); // Attempt to execute the function`
    } catch (error) {
        if (retries > 0) { // Check if there are retries left
            if (delay) {
                await new Promise(resolve => setTimeout(resolve, delay)); // Wait for the specified delay
            }
            return retryAsync(asyncFn, retries - 1, delay); // Recursively retry the function
        } else {
            throw error; // No retries left, throw the last error encountered
        }
    }
}

export { retryAsync };
