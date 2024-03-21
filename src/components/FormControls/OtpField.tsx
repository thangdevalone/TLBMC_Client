import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '../ui/input-otp';
interface TextFieldProps {
    label: string;
    name: string;
    disabled?: boolean | undefined;
    require?: boolean;
}
export const OtpField = (props: TextFieldProps) => {
    const {
        name,
        label,
        disabled = false,
        require = false,

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
                        <InputOTP
                            maxLength={6}
                            render={({ slots }) => (
                                <InputOTPGroup>
                                    {slots.map((slot, index) => (
                                        <React.Fragment key={index}>
                                            <InputOTPSlot className="rounded-md border font-semibold" {...slot} />
                                            {index !== slots.length - 1 && <InputOTPSeparator />}
                                        </React.Fragment>
                                    ))}{' '}
                                </InputOTPGroup>
                            )}
                            {...field}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};
