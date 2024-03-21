import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { InputPassword } from "../ui/inputPassword";
interface PasswordFieldProps{
    label: string;
    name: string;
    disabled?:boolean|undefined;
    placeholder:string
    autoComplete:string
    require?:boolean
}
export const PasswordField = (props:PasswordFieldProps) => {
    const { name, label ,disabled=false,placeholder,autoComplete="false",require=false } = props;
    const form = useFormContext();

    return (
        <FormField
            defaultValue=""
            control={form.control}
            name={name}
            disabled={disabled}
            render={({ field }) => (
                <FormItem className="">
                    <FormLabel className="relative">{label}{require&& <span className="text-xl absolute top-[-5px] right-[-10px] text-[red]"> *</span>}</FormLabel>
                    <FormControl>
                        <InputPassword placeholder={placeholder} autoComplete={autoComplete} {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};
