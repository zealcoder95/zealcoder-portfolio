import UpdatesPageContent from "@/components/UpdatesPageContent";
import { getAutomaticUpdates } from "@/lib/updates/getAutomaticUpdates";

export const metadata = {
  title: "Updates | ZealCoder",
  description:
    "Latest GitHub projects, Medium articles, Kaggle notebooks and ZealCoder platform updates.",
};

export const revalidate = 1800;

export default async function UpdatesPage() {
  const updates = await getAutomaticUpdates({
    limit: 50,
  });

  return (
    <UpdatesPageContent updates={updates} />
  );
}