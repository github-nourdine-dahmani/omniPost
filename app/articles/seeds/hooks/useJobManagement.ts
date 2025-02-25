import { useState, useCallback } from "react";
import { Job } from "@prisma/client";
import { getJob } from "@/lib/job";

export const useJobManagement = (initialJobs: Job[]) => {
    const [jobs, setJobs] = useState(initialJobs);
    const [selectedJob, setSelectedJob] = useState(
        initialJobs.sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        )[0]
    );

    const refreshSelectedJob = useCallback(async () => {
        const updatedJob = await getJob(selectedJob.id);
        if (!updatedJob) return;

        setSelectedJob(updatedJob);
        setJobs((prev) =>
            prev.map((job) => (job.id === updatedJob.id ? updatedJob : job))
        );
    }, [selectedJob]);

    return { jobs, selectedJob, setSelectedJob, refreshSelectedJob };
};