import {
  PillsInputField,
  Textarea,
  type TextInputProps,
} from '@mantine/core'
import { action } from '@storybook/addon-actions'
import {
  type Meta,
  type StoryObj,
} from '@storybook/react'
import { type FormProps } from 'core/props'
import {
  type SuppliedTextInputProps,
  type TextInputTarget,
} from 'mantine/create_text_input'
import { useMantineForm } from 'mantine/hooks'
import { type ComponentType } from 'react'
import { type Field } from 'types/field'
import { TEXT_INPUT_LABEL } from './text_input_constants'

type StoryTextInputProps<T extends TextInputTarget> = SuppliedTextInputProps<T> & Pick<TextInputProps, 'label'>

function Component<T extends TextInputTarget>({
  TextInput,
  ...props
}: FormProps<{
  $: Field<string, string>,
}> & {
  TextInput?: ComponentType<StoryTextInputProps<T>>,
}) {
  const form = useMantineForm(props)
  const TextInputComponent = form.textInput<'$', StoryTextInputProps<T>>('$', TextInput)
  return <TextInputComponent label={TEXT_INPUT_LABEL} />
}

const meta: Meta<typeof Component> = {
  component: Component,
  args: {
    onFieldBlur: action('onFieldBlur'),
    onFieldFocus: action('onFieldFocus'),
    onFieldSubmit: action('onFieldSubmit'),
    onFieldValueChange: action('onFieldValueChange'),
  },
}

export default meta

type Story<
  T extends TextInputTarget = HTMLInputElement,
> = StoryObj<typeof Component<T>>

export const Empty: Story = {
  args: {
    fields: {
      $: {
        disabled: false,
        required: false,
        value: '',
      },
    },
  },
}

export const Populated: Story = {
  args: {
    fields: {
      $: {
        disabled: false,
        required: false,
        value: 'Hello',
      },
    },
  },
}

export const Required: Story = {
  args: {
    fields: {
      $: {
        disabled: false,
        required: true,
        value: 'xxx',
      },
    },
  },
}

export const Disabled: Story = {
  args: {
    fields: {
      $: {
        disabled: true,
        required: false,
        value: 'xxx',
      },
    },
  },
}

export const OverriddenTextarea: Story<HTMLTextAreaElement> = {
  args: {
    fields: {
      $: {
        disabled: false,
        required: false,
        value: 'Textarea',
      },
    },
    TextInput: Textarea,
  },
}

export const OverriddenPillsInputField: Story = {
  args: {
    fields: {
      $: {
        disabled: false,
        required: false,
        value: 'PillsInputField',
      },
    },
    TextInput: PillsInputField,
  },
}
