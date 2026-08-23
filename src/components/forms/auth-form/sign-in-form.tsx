import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSet,
} from "#/components/ui/field";
import { Input } from "#/components/ui/input";

const SignInForm = () => {
	return (
		<div className="flex flex-col gap-3">
			<form>
				<FieldSet>
					<FieldLegend>Profile</FieldLegend>
					<FieldDescription>
						This appears on invoices and emails.
					</FieldDescription>
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor="name">Full name</FieldLabel>
							<Input id="name" autoComplete="off" placeholder="Evil Rabbit" />
							<FieldDescription>
								This appears on invoices and emails.
							</FieldDescription>
						</Field>
						<Field>
							<FieldLabel htmlFor="username">Username</FieldLabel>
							<Input id="username" autoComplete="off" aria-invalid />
							<FieldError>Choose another username.</FieldError>
						</Field>
					</FieldGroup>
				</FieldSet>
			</form>
		</div>
	);
};

export default SignInForm;
