import { messages } from '@domain/helpers';
import { yup } from '@infra/yup';
import type {
  AnyObject,
  AnySchema,
  BooleanSchema,
  DateSchema,
  Maybe,
  MixedSchema,
  NumberSchema,
  StringSchema
} from 'yup';
import type { messageTypeResponse } from '@domain/errors';

export const emailRequired = (field: messageTypeResponse): StringSchema =>
  yup
    .string()
    .email(JSON.stringify(messages.yup.emailSchema))
    .required(JSON.stringify(messages.yup.requiredSchema(field)));

export const emailNotRequired = (): StringSchema =>
  yup.string().email(JSON.stringify(messages.yup.emailSchema));

export const stringRequired = (field: messageTypeResponse & { length?: number }): StringSchema =>
  typeof field.length === 'number'
    ? yup
        .string()
        .trim()
        .max(field.length, JSON.stringify(messages.yup.maxLength(field, field.length)))
        .required(JSON.stringify(messages.yup.requiredSchema(field)))
    : yup
        .string()
        .trim()
        .required(JSON.stringify(messages.yup.requiredSchema(field)));

export const stringNotRequired = (
  field?: messageTypeResponse & { length: number }
): StringSchema<Maybe<string | undefined>> =>
  typeof field === 'undefined'
    ? yup.string().trim().notRequired()
    : yup
        .string()
        .trim()
        .max(field.length, JSON.stringify(messages.yup.maxLength(field, field.length)))
        .notRequired();

export const mixedRequired = (field: messageTypeResponse): MixedSchema =>
  yup.mixed().required(JSON.stringify(messages.yup.requiredSchema(field)));

export const booleanRequired = (field: messageTypeResponse): BooleanSchema =>
  yup.boolean().required(JSON.stringify(messages.yup.requiredSchema(field)));

export const booleanNotRequired = (): BooleanSchema<Maybe<boolean | undefined>> =>
  yup.boolean().notRequired();

export const mixedNotRequired = (field: messageTypeResponse): MixedSchema<Maybe<AnyObject>> =>
  yup
    .mixed()
    .required(JSON.stringify(messages.yup.requiredSchema(field)))
    .notRequired();

export const numberRequired = (field: messageTypeResponse): NumberSchema =>
  yup
    .number()
    .typeError(JSON.stringify(messages.yup.numberSchema(field)))
    .required(JSON.stringify(messages.yup.requiredSchema(field)));

export const numberNotRequired = (): NumberSchema<Maybe<number | undefined>> =>
  yup.number().notRequired();

export const dateRequired = (field: messageTypeResponse): DateSchema =>
  yup
    .date()
    .typeError(JSON.stringify(messages.yup.dateSchema))
    .required(JSON.stringify(messages.yup.requiredSchema(field)));

export const dateNotRequired = (): DateSchema<Maybe<Date | undefined>> =>
  yup.date().typeError(JSON.stringify(messages.yup.dateSchema)).notRequired();

export const arrayRequired = (data: AnySchema, field: messageTypeResponse): AnySchema =>
  yup
    .array()
    .of(data)
    .required(JSON.stringify(messages.yup.requiredSchema(field)));

export const arrayNotRequired = (data: AnySchema): AnySchema => yup.array().of(data);

export const enumTypeRequired = <Enum extends object>(
  field: messageTypeResponse & { data: Enum }
): AnySchema =>
  yup
    .mixed<Enum>()
    .oneOf(
      Object.values(field.data),
      JSON.stringify({
        english: 'inform an valid option',
        portuguese: 'informe uma opção válida'
      })
    )
    .required(JSON.stringify(messages.yup.requiredSchema(field)));

export const enumTypeNotRequired = <Enum extends object>(
  field: messageTypeResponse & { data: Enum }
): AnySchema => yup.mixed<Enum>().oneOf(Object.values(field.data));
