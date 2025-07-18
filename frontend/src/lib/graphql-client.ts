export async function graphqlRequest<T = any>(
    query: string,
    variables?: Record<string, any>
): Promise<T> {
    const response = await fetch("http://localhost:3000/graphql", {
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