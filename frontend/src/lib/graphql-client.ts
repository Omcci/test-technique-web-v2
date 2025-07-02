export async function graphqlRequest<T = any>(
    query: string,
    variables?: Record<string, any>
): Promise<T> {
    // In production, use relative URL since frontend and backend are served from same domain
    const apiUrl = import.meta.env.DEV ? (import.meta.env.VITE_API_URL || "http://localhost:3000") : "";
    const response = await fetch(`${apiUrl}/graphql`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query,
            variables,
        }),
    });

    const result = await response.json();
    if (result.errors) {
        throw new Error(result.errors[0].message);
    }
    return result.data;
}