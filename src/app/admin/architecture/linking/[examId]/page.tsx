import LinkerContent from "@/components/admin/LinkerContent";

/**
 * @fileOverview Content Linking Engine v1.4.
 * FIXED: dynamicParams: true is incompatible with output: export.
 */

export const dynamicParams = false;

export async function generateStaticParams() {
  // Pre-rendering core exam nodes for the admin architecture hub
  return [
    { examId: 'pcs' },
    { examId: 'patwari' },
    { examId: 'constable' },
    { examId: 'clerk' }
  ];
}

export default async function Page(props: { params: Promise<{ examId: string }> }) {
  const { examId } = await props.params;
  return <LinkerContent examId={examId} />;
}
