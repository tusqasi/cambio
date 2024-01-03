import Link from "next/link"
import Image from "next/image"
import { ChangeEvent, JSX, RefObject, SVGProps, useState } from "react"
import axios from "axios";
import { Toaster, toast } from "sonner";
import { useRef } from "react";
import { MutableRefObject } from "react";
import Head from "next/head";

function uploadImage(file: any, setScaledUrl: Function, scale: number, ref: MutableRefObject<HTMLDivElement>) {
	const formData = new FormData();
	formData.append("file", file as Blob);
	console.log(formData);
	const config = {
		headers: {
			"content-type": "multipart/form-data",
		},
	};
	axios
		.post(
			`https://combio-compute.fly.dev/scale?scale=${(scale / 100)}`,
			formData,
			config
		)

		.then((data) => {

			const byteCharacters = atob(data.data.image);
			const byteNumbers = new Array(byteCharacters.length);
			for (let i = 0; i < byteCharacters.length; i++) {
				byteNumbers[i] = byteCharacters.charCodeAt(i);
			}
			const byteArray = new Uint8Array(byteNumbers);

			let image = new Blob([byteArray], { type: data.data.type });
			setScaledUrl(URL.createObjectURL(image));
			// toast.success("Resized image")
			ref.current.scrollIntoView({ block: "start", behavior: "smooth" });
		})
		.catch((err) => console.error(err));
}

export default function Component() {
	const [imageFileUrl, setImageFileUrl] = useState<string>("");
	const [imageFile, setImageFile] = useState<File>();
	// const [scaledFile, setScaledFile] = useState<File>();
	const [scaledUrl, setScaledUrl] = useState<string>("");
	const [scalePercent, setScalePercent] = useState<number>(50);
	const scrollRef = useRef<HTMLDivElement>();
	const fileAdded = (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			const file = event.target.files[0];
			const file_url = URL.createObjectURL(event.target.files[0]);
			setImageFileUrl(file_url);
			setImageFile(file);
		}
	};
	return (
		<>
			<Toaster />
			<Head>
				<meta property="og:title" content="Cambio - An image resize utility" />
				<meta property="og:description" content="Cambio - An image resize utility made in nextjs" />
				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://cambio-eight.vercel.app/" />
				<meta property="og:image" content="https://i.imgur.com/QDHBAhf.png" />
			</Head>
			<div className=" h-[100svh] flex flex-col justify-between  ">
				<header className="flex justify-center py-6 bg-[#ffffff]">
					<h1 className="text-4xl font-bold  ">Cambio</h1>
				</header>
				<main className="container mx-auto max-w-3xl p-4">
					<div className=" rounded-xl border  text-card-foreground shadow-sm p-4 ">
						<span className="text-2xl font-semibold p-3 ">Upload Image</span>
						<div className="flex flex-col p-10  gap-4 ">
							<label className=" font-medium  text-sm ">
								Choose Image <span className="font-light  text-gray-600 "> (.png, .jpg) </span>
								<input type="file"
									className=" flex h-10 w-full rounded border shadow-sm  bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground  focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 "
									onInput={fileAdded}
									accept="image/*"
								/>
							</label>
							<label className=" font-medium  text-sm ">
								Set scale in percent <span className="font-light  text-gray-600 "> (140%, 50% ) </span>
								<input type="number"
									className=" flex h-10 w-full rounded border shadow-sm  bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 "
									onChange={(e) => {
										setScalePercent(parseInt(e.target.value));
									}}
									value={scalePercent}
									placeholder="Scale"

								/>
							</label>
							<div className="   w-full  flex flex-col  items-center">
								<button
									disabled={imageFileUrl.length <= 0}
									className=" p-3 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50  border border-input bg-background hover:bg-gray-100 hover:text-accent-foreground"
									onClick={() => {
										if (!Number.isInteger(scalePercent)) {
											toast.warning("Scale wrong");
											return;
										}
										if (imageFileUrl == "") {
											toast.warning("No image file given to upload");
											return;
										}

										uploadImage(imageFile, setScaledUrl, scalePercent, scrollRef as MutableRefObject<HTMLDivElement>);
									}}
								>
									Resize
								</button>
							</div>
						</div>
						<div className=" w-full h-full flex flex-col justify-center items-center   ">
							{
								imageFileUrl == "" ?
									<div className="  h-[400px] w-[400px] overflow-clip   rounded-xl p-2 bg-slate-100 flex flex-col justify-center items-center border border-zinc-200  ">
										<Image
											src={"https://placehold.co/400x300/png?text=Preview%20here"}
											width="400"
											height="300"
											alt="Preview" />
									</div>
									:
									<div className="  h-[400px] w-[400px]   rounded-xl p-2 bg-slate-100 flex flex-col justify-center items-center border border-zinc-200  ">
										<Image
											src={imageFileUrl}
											width="400"
											height="300"
											alt="Image Preview"
											className=" object-cover  "
										/>
									</div>

							}
						</div>
					</div>
					<div className=" p-3 ">
					</div>
					<div className=" flex flex-col justify-center items-center rounded-xl border  text-card-foreground shadow-sm p-4 "
						ref={scrollRef as MutableRefObject<HTMLDivElement>}>
						<div className="flex flex-col justify-start items-start w-full p-3 ">
							<span className="text-2xl font-semibold  ">Processed Image</span>
						</div>
						<div className=" w-full h-full  flex flex-col justify-center items-center   ">
							{
								scaledUrl == "" ?
									<div className="  h-[400px] w-[400px] overflow-clip   rounded-xl p-2 bg-slate-100 flex flex-col justify-center items-center border border-zinc-200  ">
										<Image
											src={"https://placehold.co/400x300/png?text=Processed%20Preview%20Here"}
											width="400"
											height="300"
											alt="Preview" />
									</div>
									:
									<div className="  h-[400px] w-[400px]   rounded-xl p-2 bg-slate-100 flex flex-col justify-center items-center border border-zinc-200  ">
										<Image
											src={scaledUrl}
											width="400"
											height="300"
											alt="Uploaded Image Preview"
											className=" object-cover  "
										/>
									</div>

							}
						</div>
						<div className=" p-1">
							<button
								disabled={scaledUrl == ""}
								className=" p-3 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50  border border-input bg-background hover:bg-gray-100 hover:text-accent-foreground"
								onClick={() => {
									if (!scaledUrl || !imageFile)
										return;
									const link = document.createElement("a");
									link.href = scaledUrl;
									link.setAttribute("download", `resized_${imageFile.name}`); //or any other extension
									document.body.appendChild(link);
									link.click();
								}}
							>
								Download
							</button>
						</div>
					</div>
				</main >
				<footer className=" flex justify-center gap-6 p-6 bg-black">
					<Link
						aria-label="LinkedIn"
						href="https://www.linkedin.com/in/tushar-kuntawar-9a7b8923b/"
						target="_blank"
						className=" transition-transform  scale-100 hover:scale-110  "
					>
						<LinkedinIcon className="w-4 h-4 text-white" />
					</Link>
					<Link
						aria-label="Twitter"
						href="https://twitter.com/tusharkuntawar"
						target="_blank"
						className=" transition-transform  scale-100 hover:scale-110  "
					>
						<TwitterIcon className="w-4 h-4 text-white" />
					</Link>
					<Link
						aria-label="GitHub"
						href="https://github.com/tusqasi/"
						target="_blank"
						className=" transition-transform  scale-100 hover:scale-110  "
					>
						<GithubIcon className="w-4 h-4 text-white" />
					</Link>
				</footer>
			</div >
		</>
	)
}



function LinkedinIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
			<rect width="4" height="12" x="2" y="9" />
			<circle cx="4" cy="4" r="2" />
		</svg>
	)
}


function TwitterIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
		</svg>
	)
}

function GithubIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
			<path d="M9 18c-4.51 2-5-2-7-2" />
		</svg>
	);
}
