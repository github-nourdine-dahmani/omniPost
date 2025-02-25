import { getAllTransformations } from "@/lib/transformations";

import PageClient from './page-client';

// Add metadata export
export const metadata = {
    title: "AzNews - Transformations",
    description: "Latest Transformations",
};

// Add revalidate
export const revalidate = 3600; // revalidate every hour

export default async function Transformations() {

    const transformations = await getAllTransformations();

    return (
        <>
            <PageClient transformations={transformations} />
        </>
    );
}
