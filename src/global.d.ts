type APIResult = "success" | "fail" | "unsure" | "ratelimit"
type APIResponse = {
    status: APIResult
    data: string
}

type LevelPack = {
    ID: number,
    name: string,
    author: string,
    description: string,
    date: number,
    version: string
}

type PostLevelPack = {
    name: string,
    author: string,
    description: string,
    data: string,
    struct_version: string
}