import React from 'react';
import { FormControl, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>; // Ensure 'name' matches the structure of 'T'
  label: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'file' | 'number';
}

const FormField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = 'text',
}: FormFieldProps<T>) => (
  <FormItem>
    <FormLabel className='label'>{label}</FormLabel>
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControl>
          <Input className='input'  type={type} placeholder={placeholder} {...field} />
        </FormControl>
      )}
    />
    <FormMessage />
  </FormItem>
);

export default FormField;