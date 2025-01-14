import { Adapt, Button, Input, Label, Popover, XStack, YStack } from "tamagui";
import type { PopoverProps } from 'tamagui'
export function ChatOptons({
    Icon,
    Name,
    shouldAdapt,
    ...props
  }: PopoverProps & { Icon?: any; Name?: string; shouldAdapt?: boolean }) {
    return (
      <Popover size="$5" allowFlip {...props}>
        <Popover.Trigger asChild>
          <Button icon={Icon} />
        </Popover.Trigger>
  
        {shouldAdapt && (
          <Adapt platform="touch">
            <Popover.Sheet modal dismissOnSnapToBottom>
              <Popover.Sheet.Frame padding="$4">
                <Adapt.Contents />
              </Popover.Sheet.Frame>
              <Popover.Sheet.Overlay
                animation="lazy"
                enterStyle={{ opacity: 0 }}
                exitStyle={{ opacity: 0 }}
              />
            </Popover.Sheet>
          </Adapt>
        )}
  
        <Popover.Content
          borderWidth={1}
          borderColor="$borderColor"
          enterStyle={{ y: -10, opacity: 0 }}
          exitStyle={{ y: -10, opacity: 0 }}
          elevate
          animation={[
            'quick',
            {
              opacity: {
                overshootClamping: true,
            
              },
            },
          ]}
        >
          <Popover.Arrow borderWidth={1} borderColor="$borderColor" />
  
          <YStack gap="$3">
            <XStack gap="$3">
              <Label size="$3" htmlFor={Name}>
                Name
              </Label>
              <Input flex={1} size="$3" id={Name} />
            </XStack>
  
            <Popover.Close asChild>
              <Button
                size="$3"
                onPress={() => {
                  /* Custom code goes here, does not interfere with popover closure */
                }}
              >
                Submit
              </Button>
            </Popover.Close>
          </YStack>
        </Popover.Content>
      </Popover>
    )
  }