"use client";

import { AlertDialog, Button } from "@heroui/react";
import { useState } from "react";

/**
 * A destructive-action confirmation. Renders `trigger` and opens a dialog;
 * the confirm button shows a spinner while `onConfirm` runs.
 */
export function ConfirmDialog({
  trigger,
  title,
  body,
  confirmLabel = "Delete",
  onConfirm,
}: {
  trigger: (open: () => void) => React.ReactNode;
  title: string;
  body: React.ReactNode;
  confirmLabel?: string;
  onConfirm: () => Promise<unknown>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function confirm() {
    setIsPending(true);
    try {
      await onConfirm();
      setIsOpen(false);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <>
      {trigger(() => setIsOpen(true))}
      <AlertDialog.Backdrop isOpen={isOpen} onOpenChange={setIsOpen}>
        <AlertDialog.Container size="sm">
          <AlertDialog.Dialog>
            <AlertDialog.Header>
              <AlertDialog.Icon status="danger" />
              <AlertDialog.Heading>{title}</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>{body}</AlertDialog.Body>
            <AlertDialog.Footer>
              <Button slot="close" variant="tertiary">
                Cancel
              </Button>
              <Button isPending={isPending} variant="danger" onPress={confirm}>
                {confirmLabel}
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </>
  );
}
