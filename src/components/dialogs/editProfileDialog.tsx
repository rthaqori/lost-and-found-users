import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { User, CheckCircle2 } from "lucide-react";
import { useUpdateUser } from "@/hooks/useUsers";

const editProfileSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
});

type EditProfileFormData = z.infer<typeof editProfileSchema>;

interface EditProfileDialogProps {
  trigger?: React.ReactNode;
  currentName: string;
  userId: string;
}

export function EditProfileDialog({
  trigger,
  currentName,
  userId,
}: EditProfileDialogProps) {
  const [open, setOpen] = useState(false);
  const updateUser = useUpdateUser();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: currentName,
    },
  });

  // Watch the name field value
  const nameValue = watch("name");

  const onSubmit = async (data: EditProfileFormData) => {
    try {
      await updateUser.mutateAsync({
        id: userId,
        data: {
          name: data.name,
        },
      });

      reset({ name: data.name });
      setOpen(false);
    } catch (error) {
      // Error is handled in the hook
      console.error(error);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset form to current name when closing without saving
      reset({ name: currentName });
    }
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <User className="h-4 w-4" />
            Edit Profile
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information. Your name will be visible to other
            users.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldGroup className="gap-0 space-y-4 py-2">
            {/* Name Field */}
            <Field orientation="vertical" className="gap-0 space-y-1">
              <FieldLabel
                htmlFor="name"
                className={`flex items-center gap-2 text-sm font-medium ${
                  errors.name ? "text-red-500" : "text-foreground"
                }`}
              >
                <User
                  className={`h-4 w-4 ${
                    errors.name ? "text-red-500" : "text-muted-foreground"
                  }`}
                />
                Full Name
              </FieldLabel>
              <div className="relative">
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  className="pr-10"
                  {...register("name")}
                  aria-invalid={!!errors.name}
                  disabled={isSubmitting || updateUser.isPending}
                  autoComplete="name"
                />
                {!errors.name && nameValue && nameValue.length > 0 && (
                  <CheckCircle2 className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-green-500" />
                )}
              </div>
              {errors.name && (
                <FieldError className="flex items-center gap-1 text-xs text-red-500">
                  {errors.name.message}
                </FieldError>
              )}

              {/* Character counter */}
              {nameValue && (
                <div className="text-muted-foreground mt-1 text-right text-xs">
                  {nameValue.length}/50 characters
                </div>
              )}
            </Field>

            {/* Info message */}
            <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-600 dark:bg-blue-950/20 dark:text-blue-400">
              <p>
                💡 Note: Only your name can be edited at this time. Other
                profile settings will be available soon.
              </p>
            </div>
          </FieldGroup>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting || updateUser.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || updateUser.isPending}
            >
              {isSubmitting || updateUser.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span>Saving...</span>
                </div>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
