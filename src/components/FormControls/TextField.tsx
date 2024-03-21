import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
interface TextFieldProps {
    label: string;
    name: string;
    disabled?: boolean | undefined;
    placeholder: string;
    autoComplete?: string;
    require?: boolean;
    type?: string;
}
export const TextField = (props: TextFieldProps) => {
    const {
        name,
        label,
        disabled = false,
        placeholder,
        autoComplete = 'false',
        require = false,
        type = 'text',
    } = props;
    const form = useFormContext();

    return (
        <FormField
            control={form.control}
            name={name}
            disabled={disabled}
            render={({ field }) => (
                <FormItem className="">
                    <FormLabel className="relative">
                        {label}
                        {require && (
                            <span className="text-xl absolute top-[-5px] right-[-10px] text-[red]">
                                {' '}
                                *
                            </span>
                        )}
                    </FormLabel>
                    <FormControl>
                        <Input
                            type={type}
                            placeholder={placeholder}
                            autoComplete={autoComplete}
                            {...field}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};
