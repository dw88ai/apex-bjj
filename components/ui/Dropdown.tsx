import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Menu, Button as PaperButton } from 'react-native-paper';
import { Colors } from '../../constants/colors';
import { spacing } from '../../constants/theme';

interface DropdownProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

export const Dropdown: React.FC<DropdownProps> = ({ label, value, options, onChange }) => {
  const [visible, setVisible] = useState(false);

  const selectedLabel = options.find(opt => opt.value === value)?.label || 'Select...';

  return (
    <View style={styles.container}>
      <Text variant="labelLarge" style={styles.label}>
        {label}
      </Text>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <PaperButton
            mode="outlined"
            onPress={() => setVisible(true)}
            style={styles.button}
            contentStyle={styles.buttonContent}
            textColor={Colors.text}
          >
            {selectedLabel}
          </PaperButton>
        }
        contentStyle={styles.menu}
      >
        {options.map(option => (
          <Menu.Item
            key={option.value}
            onPress={() => {
              onChange(option.value);
              setVisible(false);
            }}
            title={option.label}
            titleStyle={{ color: Colors.text }}
          />
        ))}
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
  },
  label: {
    color: Colors.text,
    marginBottom: spacing.xs,
  },
  button: {
    borderColor: Colors.border,
    borderRadius: 8,
  },
  buttonContent: {
    justifyContent: 'flex-start',
  },
  menu: {
    backgroundColor: Colors.surface,
  },
});
