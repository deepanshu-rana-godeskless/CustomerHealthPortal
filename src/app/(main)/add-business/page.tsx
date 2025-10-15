/**
 * Customer Health Portal - Add Business Page
 * GoDeskless Inc.
 */
import { AddBusinessForm } from "./_components/add-business-form";

export default function AddBusinessPage() {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Add New Business</h1>
        <p className="text-muted-foreground">
          Create a new customer or prospect account with their business details and licensing information.
        </p>
      </div>

      <AddBusinessForm />
    </div>
  );
}
