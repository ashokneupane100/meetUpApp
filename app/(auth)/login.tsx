import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  View,
  AppState,
  TextInput,
  Text,
  Pressable,
  ScrollView,
} from "react-native";
import { supabase } from "@/lib/supabase";
import { Stack } from "expo-router";

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage(text);
    setMessageType(type);
    // Auto-hide message after 5 seconds
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 5000);
  };

  async function signInWithEmail() {
    setLoading(true);
    setMessage(""); // Clear previous messages

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        showMessage(
          "❌ Invalid email or password. Please check your credentials and try again.",
          "error"
        );
        Alert.alert(
          "Sign In Failed",
          "Invalid email or password. Please check your credentials and try again."
        );
      } else if (error.message.includes("Email not confirmed")) {
        showMessage(
          "📧 Please check your email and click the verification link before signing in.",
          "error"
        );
        Alert.alert(
          "Email Not Verified",
          "Please check your email and click the verification link before signing in."
        );
      } else {
        showMessage(`❌ Sign in failed: ${error.message}`, "error");
        Alert.alert("Sign In Error", error.message);
      }
    } else {
      showMessage("✅ Successfully signed in!", "success");
    }
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    setMessage(""); // Clear previous messages

    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.log("Sign up error:", error);

        if (
          error.message.includes("User already registered") ||
          error.message.includes("already registered") ||
          error.status === 422
        ) {
          const userMessage = `🚫 Account Already Exists!\n\nA user with the email "${email}" has already been registered.\n\nPlease try signing in instead or use a different email address.`;
          showMessage(userMessage, "error");

          // Also show the native alert
          Alert.alert(
            "Account Already Exists",
            `A user with the email "${email}" has already been registered. Please try signing in instead or use a different email address.`,
            [{ text: "OK", style: "default" }]
          );
        } else if (error.message.includes("Password should be at least")) {
          showMessage(
            "🔒 Password should be at least 6 characters long.",
            "error"
          );
          Alert.alert(
            "Weak Password",
            "Password should be at least 6 characters long."
          );
        } else if (error.message.includes("Unable to validate email address")) {
          showMessage("📧 Please enter a valid email address.", "error");
          Alert.alert("Invalid Email", "Please enter a valid email address.");
        } else {
          showMessage(`❌ Sign up failed: ${error.message}`, "error");
          Alert.alert("Sign Up Error", error.message);
        }
      } else if (!session) {
        showMessage(
          "📧 Check your email! We sent you a verification link to activate your account.",
          "success"
        );
        Alert.alert(
          "Verification Required",
          "Please check your inbox for email verification! Click the link in the email to activate your account."
        );
      } else {
        showMessage("🎉 Account created successfully! Welcome!", "success");
      }
    } catch (err) {
      console.error("Unexpected error during sign up:", err);
      showMessage(
        "❌ An unexpected error occurred. Please try again.",
        "error"
      );
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    }

    setLoading(false);
  }

  return (
    <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ title: "Welcome Back!", headerTitleStyle: { fontSize: 18 } }} />
      
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.welcomeTitle}>Welcome! 👋</Text>
          <Text style={styles.subtitle}>Sign in to your account or create a new one</Text>
        </View>

        {/* ON-SCREEN MESSAGE FOR USERS */}
        {message !== "" && (
          <View
            style={[
              styles.messageContainer,
              messageType === "error"
                ? styles.errorMessage
                : styles.successMessage,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                messageType === "error" ? styles.errorText : styles.successText,
              ]}
            >
              {message}
            </Text>
          </View>
        )}

        {/* Form Section */}
        <View style={styles.formSection}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>📧 Email Address</Text>
            <TextInput
              onChangeText={(text) => setEmail(text)}
              value={email}
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              editable={!loading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>🔒 Password</Text>
            <TextInput
              onChangeText={(text) => setPassword(text)}
              value={password}
              style={styles.input}
              secureTextEntry={true}
              placeholder="Enter your password (min. 6 characters)"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
              autoComplete="password"
              editable={!loading}
            />
          </View>

          {/* Buttons Section */}
          <View style={styles.buttonsContainer}>
            {/* Primary Sign In Button */}
            <Pressable
              style={[
                styles.primaryButton,
                loading && styles.buttonDisabled
              ]}
              disabled={loading}
              onPress={signInWithEmail}
            >
              <Text style={styles.primaryButtonText}>
                {loading ? "🔄 Signing in..." : "🔑 Sign In"}
              </Text>
            </Pressable>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Secondary Sign Up Button */}
            <Pressable
              style={[
                styles.secondaryButton,
                loading && styles.buttonDisabled
              ]}
              disabled={loading}
              onPress={signUpWithEmail}
            >
              <Text style={styles.secondaryButtonText}>
                {loading ? "🔄 Creating account..." : "✨ Create New Account"}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 20,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 32,
    paddingTop: 20,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
  },
  messageContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1.5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  errorMessage: {
    backgroundColor: "#FEF2F2",
    borderColor: "#F87171",
  },
  successMessage: {
    backgroundColor: "#ECFDF5",
    borderColor: "#34D399",
  },
  messageText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 20,
  },
  errorText: {
    color: "#DC2626",
  },
  successText: {
    color: "#059669",
  },
  formSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    color: "#1F2937",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  buttonsContainer: {
    marginTop: 8,
  },
  primaryButton: {
    backgroundColor: "#3B82F6",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#3B82F6",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#3B82F6",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  secondaryButtonText: {
    color: "#3B82F6",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  footer: {
    alignItems: "center",
    paddingHorizontal: 16,
  },
  footerText: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 18,
  },
});