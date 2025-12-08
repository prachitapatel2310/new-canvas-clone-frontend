"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import type { RootState } from "../store";

export default function AccountPage() {
	const { currentUser } = useSelector((state: RootState) => state.accountReducer);
	const router = useRouter();

	useEffect(() => {
		if (!currentUser) {
			router.replace("/Account/Signin");
		} else {
			router.replace("/Account/Profile");
		}
	}, [currentUser, router]);

	return null;
}
