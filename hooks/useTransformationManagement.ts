import { useState, useCallback } from "react";
import { Transformation } from "@prisma/client";
import { getTransformation } from "@/lib/transformations";

export const useTransformationManagement = (initialTransformations: Transformation[]) => {
    const [transformations, setTransformations] = useState(initialTransformations);
    const [selectedTransformation, setSelectedTransformation] = useState(
        initialTransformations.sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        )[0]
    );

    const refreshSelectedTransformation = useCallback(async () => {
        const updatedTransformation = await getTransformation(selectedTransformation.id);
        if (!updatedTransformation) return;

        setSelectedTransformation(updatedTransformation);
        setTransformations((prev) =>
            prev.map((transformation) => (transformation.id === updatedTransformation.id ? updatedTransformation : transformation))
        );
    }, [selectedTransformation]);

    return { transformations, selectedTransformation, setSelectedTransformation, refreshSelectedTransformation };
};