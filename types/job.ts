// export interface Job {
//     id: number;
//     type: JobType;
//     params: string | null;
//     data: string | null;
//     status: JobStatus;
//     createdAt: Date;
// }

// export enum JobStatus {
//     Ready = 'ready',
//     Pending = 'pending',
//     Processing = 'processing',
//     Completed = 'completed',
//     Failed = 'failed',
//     Unknown = 'unknown',
// }

// export enum JobType {
//     FetchTopNews = 'fetch-top-news',
//     RefineArticle = 'refine-article',
//     Unknown = 'unknown',
// }

// export function isValidJobType(type: string): type is JobType {
//     return Object.values(JobType).includes(type as JobType);
// }

// export function isValidJobStatus(status: string): status is JobStatus {
//     return Object.values(JobStatus).includes(status as JobStatus);
// }

// export function parseJobType(type: string): JobType {
//     const matchedType = Object.values(JobType).find(jobType => jobType === type);
//     return matchedType || JobType.Unknown;
// }

// export function parseJobStatus(status: string): JobStatus {
//     const matchedStatus = Object.values(JobStatus).find(jobStatus => jobStatus === status);
//     return matchedStatus || JobStatus.Unknown;
// }