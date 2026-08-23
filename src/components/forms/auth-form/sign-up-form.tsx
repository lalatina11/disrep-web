import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, buttonVariants } from "#/components/ui/button";
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
import { signUpAction } from "#/lib/server-actions/auth";
import { type SignUpSchemaType, signUpSchema } from "#/lib/validations/auth";

const SignUpForm = () => {
	const [showPassword, setShowPassword] = useState({
		password: false,
		confirm_password: false,
	});
	const nav = useNavigate();
	const form = useForm({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			email: "",
			password: "",
			confirm_password: "",
			data: { display_name: "" },
		},
	});

	async function onSubmit(data: SignUpSchemaType) {
		if (data.password !== data.confirm_password) {
			return form.setError("confirm_password", {
				message: "Password tidak sesuai",
			});
		}
		const res = await signUpAction({ data });
		if (!res.success) {
			return form.setError("root", { message: res.message });
		}
		return nav({ to: "/" });
	}

	return (
		<div className="flex flex-col gap-3">
			<form onClick={form.handleSubmit(onSubmit)}>
				<FieldSet>
					{form.getErrors().root && (
						<FieldError errors={[form.getErrors().root]} />
					)}
					<Controller
						name="data.display_name"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor={field.name}>Nama</FieldLabel>
								<Input
									{...field}
									id={field.name}
									aria-invalid={fieldState.invalid}
									placeholder="John Doe"
									autoComplete="off"
								/>
								{!fieldState.invalid && (
									<FieldDescription>Masukkan nama anda</FieldDescription>
								)}
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
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
										type={showPassword.password ? "text" : "password"}
										autoComplete="off"
									/>
									<InputGroupAddon align={"inline-end"}>
										<div
											onClick={() =>
												setShowPassword((p) => ({
													...p,
													password: !p.password,
												}))
											}
											className={buttonVariants({ variant: "ghost" })}
										>
											{showPassword.password ? <EyeClosed /> : <Eye />}
										</div>{" "}
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
					<Controller
						name="confirm_password"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor={field.name}>
									Konfirmasi Password
								</FieldLabel>
								<InputGroup>
									<InputGroupInput
										{...field}
										id={field.name}
										aria-invalid={fieldState.invalid}
										placeholder="john@email.com"
										autoComplete="off"
										type={showPassword.confirm_password ? "text" : "password"}
									/>
									<InputGroupAddon align={"inline-end"}>
										<div
											onClick={() =>
												setShowPassword((p) => ({
													...p,
													confirm_password: !p.confirm_password,
												}))
											}
											className={buttonVariants({ variant: "ghost" })}
										>
											{showPassword.confirm_password ? <EyeClosed /> : <Eye />}
										</div>
									</InputGroupAddon>
								</InputGroup>
								{!fieldState.invalid && (
									<FieldDescription>Konfirmasi password </FieldDescription>
								)}
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
					<Button type="submit">Daftar Sekarang</Button>
				</FieldSet>
			</form>
		</div>
	);
};

export default SignUpForm;
