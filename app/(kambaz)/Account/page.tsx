"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/redux/store";

export default function AccountPage() {
	const router = useRouter();
	const { currentUser } = useSelector((state: RootState) => state.accountReducer);

	useEffect(() => {
		if (currentUser) {
			router.push("/Account/Profile");
		} else {
			router.push("/Account/Signin");
		}
	}, [currentUser, router]);

	return null;
}
