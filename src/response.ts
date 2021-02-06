type APIResult = "success" | "fail" | "unsure" | "ratelimit"
type APIResponse = {
    status: APIResult
    data: string
}

export async function makeAPIResponse(status: APIResult, data: string): Promise<APIResponse> {
    return {status, data}
}

export default makeAPIResponse;