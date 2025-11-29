interface HostsDTO {
    id? : number,
    label: string
    value: string
}
interface FormData {
    taskName: string
    scriptSource: string
    scriptType: string
    scriptContent: string
    scriptParams: string
    timeout: number
    execUser: string
    targetServers: string[]
    autoScroll: boolean
}
