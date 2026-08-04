interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function BrandPage({
  params,
}: Props) {
  const { id } = await params;

  return (
    <div>
      <h1>Brand {id}</h1>
    </div>
  );
}