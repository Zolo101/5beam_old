export function joinStringArray(arr: string | string[]): string {
    return Array.isArray(arr) ? arr.join("") : arr;
}

export async function makeAPIResponse(status: APIResult, data: string | string[]): Promise<APIResponse> {
    return {status, data: joinStringArray(data)};
}

export default makeAPIResponse;