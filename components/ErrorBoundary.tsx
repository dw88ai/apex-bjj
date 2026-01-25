import React, { Component, ReactNode, ErrorInfo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button as PaperButton } from 'react-native-paper';
import { Colors } from '../constants/colors';
import { spacing } from '../constants/theme';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text variant="displaySmall" style={styles.title}>
            Oops! Something went wrong
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            The app encountered an unexpected error
          </Text>
          <Text variant="bodyMedium" style={styles.error}>
            {this.state.error?.message}
          </Text>
          <PaperButton
            mode="contained"
            onPress={this.handleReset}
            style={styles.button}
            buttonColor={Colors.primary}
          >
            Try Again
          </PaperButton>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  title: {
    color: Colors.text,
    fontWeight: 'bold',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    color: Colors.textSecondary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  error: {
    color: Colors.error,
    marginBottom: spacing.xl,
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  button: {
    marginTop: spacing.lg,
  },
});
