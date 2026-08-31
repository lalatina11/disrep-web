import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "#/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
	FieldSet,
} from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "#/components/ui/input-group";
import { Spinner } from "#/components/ui/spinner";
import { signInAction } from "#/lib/server-actions/auth";
import useUserStore from "#/lib/stores/use-user-store";
import { type SignInSchemaType, signInSchema } from "#/lib/validations/auth";

const SignInForm = () => {
	const { setUser } = useUserStore();
	const [showPassword, setShowPassword] = useState(false);
	const nav = useNavigate();
	const form = useForm({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	async function onSubmit(data: SignInSchemaType) {
		const res = await signInAction({ data });
		if (!res.success || res.data === null) {
			return form.setError("root", { message: res.message || "Login gagal!" });
		}
		setUser(res.data);
		toast.success("Login berhasil!", {
			description: "Anda akan diarahkan ke halaman utama",
		});
		return nav({ to: "/" });
	}

	const isFormBusy = form.formState.isSubmitting || form.formState.isLoading;

	return (
		<div className="flex flex-col gap-3">
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<FieldSet>
					{form.formState.errors.root && (
						<FieldError errors={[form.formState.errors.root]} />
					)}
					<Controller
						name="email"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor={field.name}>Email</FieldLabel>
								<Input
									{...field}
									id={field.name}
									aria-invalid={fieldState.invalid}
									placeholder="john@email.com"
									autoComplete="off"
								/>
								{!fieldState.invalid && (
									<FieldDescription>
										Masukkan alamat email anda
									</FieldDescription>
								)}
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
					<Controller
						name="password"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor={field.name}>Password</FieldLabel>
								<InputGroup>
									<InputGroupInput
										{...field}
										id={field.name}
										aria-invalid={fieldState.invalid}
										placeholder="john@email.com"
										type={showPassword ? "text" : "password"}
										autoComplete="off"
									/>
									<InputGroupAddon align={"inline-end"}>
										<Button
											type="button"
											variant="ghost"
											size="icon-sm"
											onClick={() => setShowPassword((p) => !p)}
										>
											{showPassword ? <EyeClosed /> : <Eye />}
										</Button>
									</InputGroupAddon>
								</InputGroup>
								{!fieldState.invalid && (
									<FieldDescription>
										Masukkan password untuk akun anda
									</FieldDescription>
								)}
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
					<Button disabled={isFormBusy} type="submit">
						{isFormBusy ? <Spinner /> : "Masuk"}
					</Button>
				</FieldSet>
			</form>
		</div>
	);
};

export default SignInForm;
