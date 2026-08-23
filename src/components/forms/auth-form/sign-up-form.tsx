import { zodResolver } from "@hookform/resolvers/zod";
import { Eye } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
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
import { type SignUpSchemaType, signUpSchema } from "#/lib/validations/auth";

const SignUpForm = () => {
	const form = useForm({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			email: "",
			password: "",
			data: { display_name: "" },
		},
	});

	function onSubmit(data: SignUpSchemaType) {
		console.log({ data });
	}

	return (
		<div className="flex flex-col gap-3">
			<form onClick={form.handleSubmit(onSubmit)}>
				<FieldSet>
					<Controller
						name="data.display_name"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor={field.name}>Bug Title</FieldLabel>
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
								<FieldLabel htmlFor={field.name}>Bug Title</FieldLabel>
								<Input
									{...field}
									id={field.name}
									aria-invalid={fieldState.invalid}
									placeholder="john@email.com"
									autoComplete="off"
								/>
								{!fieldState.invalid && (
									<FieldDescription>Masukkan email anda</FieldDescription>
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
								<FieldLabel htmlFor={field.name}>Bug Title</FieldLabel>
								<InputGroup>
									<InputGroupInput
										{...field}
										id={field.name}
										aria-invalid={fieldState.invalid}
										placeholder="john@email.com"
										autoComplete="off"
									/>
									<InputGroupAddon align={"inline-end"}>
										<Eye />
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
					<Button>Daftar Sekarang</Button>
				</FieldSet>
			</form>
		</div>
	);
};

export default SignUpForm;
