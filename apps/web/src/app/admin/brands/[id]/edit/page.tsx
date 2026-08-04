interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditBrandPage({
  params,
}: Props) {
  const { id } = await params;

  return (
    <div>
      <h1>Edit Brand {id}</h1>
    </div>
  );
}