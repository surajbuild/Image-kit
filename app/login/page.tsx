"use client"

import Link from "next/link"
import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner";

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        if (loading) return;
        e.preventDefault();
        try {
            setLoading(true);
            const res = await signIn("credentials", {
                email: email.trim().toLowerCase(),
                password,
                redirect: false,
            });
            if (!res || res.error) {
                toast.error("Invalid email or password");
                return;
            }
            toast.success("Login successful");
            router.replace("/dashboard");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        if (loading) return;
        try {
            setLoading(true);
            await signIn("google", { callbackUrl: '/dashboard' });
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "An unexpected error occurred");
        }
        finally {
            setLoading(false);
        }
    }

    const handleGithubSignIn = async () => {
        if (loading) return;
        try {
            setLoading(true);
            await signIn("github", { callbackUrl: '/dashboard' });
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "An unexpected error occurred");
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
                <div className="card w-full max-w-md bg-base-100 shadow-2xl">
                    <div className="card-body">
                        <h1 className="text-3xl font-bold text-center mb-6">
                            Login
                        </h1>
                        <form onSubmit={handleSubmit} className="space-y-4">

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Email</span>
                                </label>

                                <input
                                    disabled={loading}
                                    type="email"
                                    autoComplete="email"
                                    className="input input-bordered w-full"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />

                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Password</span>
                                </label>

                                <input
                                    disabled={loading}
                                    type="password"
                                    autoComplete="current-password"
                                    className="input input-bordered w-full"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-full"
                                disabled={loading}
                            >
                                {loading && (
                                    <span className="loading loading-spinner loading-sm mr-2"></span>
                                )}

                                {loading ? "Signing in..." : "Login"}
                            </button>
                        </form>


                        <div className="divider">OR</div>
                        <button
                            type="button"
                            onClick={handleGoogleSignIn}
                            disabled={loading}
                            className="btn btn-outline w-full"
                        >
                            Continue with Google
                        </button>

                        <button
                            type="button"
                            onClick={handleGithubSignIn}
                            disabled={loading}
                            className="btn btn-outline w-full mt-3"
                        >
                            Continue with GitHub
                        </button>

                        <p className="text-center text-sm mt-4">
                            Don't have an account?{" "}
                            <Link
                                href="/register"
                                className="link link-primary"
                            >
                                Register
                            </Link>
                        </p>
                    </div>
                </div>

            </div>
        </div>
    )
}


export default Login;