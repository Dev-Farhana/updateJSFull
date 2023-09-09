import {
	auth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	onAuthStateChanged,
	signOut,
	doc,
	setDoc,
	db,
	getDoc,
	updateDoc,
	getStorage,
	storage,
	ref,
	uploadBytesResumable,
	getDownloadURL,
	reauthenticateWithCredential,
	EmailAuthProvider,
	updatePassword,
	collection,
	addDoc,
	serverTimestamp,
	query,
	where,
	getDocs,
	deleteDoc,
} from './firebaseConfig.js';

let flag = true;

const profilePicture = document.getElementById('profilePicture');

// if (docSnap.exists()) {
// 		console.log('Document data:', docSnap.data());
// 		if (location.pathname === '/blog.html') {
// 			let fullName = document.getElementById('fullName');
// 			fullName.innerHTML = docSnap.data().fullName;
// 			hideLoader();
// 		}
// 		else if (location.pathname !== '/allblog.html') {
// 			if (location.pathname === "/user.html") {
				
// 			}
// 			else {
				
// 				userUid.value = docSnap.uid;
// 				fullName.value = docSnap.data().fullName;
// 				email.value = docSnap.data().email;	
// 				phone.value = docSnap.data().phone;
// 				if (docSnap.data().profile) {
// 					profilePicture.src = docSnap.data().profile;
// 				}
	
// 				console.log(uid);
// 			}
// 		}
// 		hideLoader();
// 	} else {
// 		// docSnap.data() will be undefined in this case
// 		console.log('No such document!');
// 		hideLoader();
// 	}
// };
let getuser = async (uid) => {
	showLoader();
	console.log('Start Karein', uid);
	const docRef = doc(db, 'UsersSignUp', uid);
	let fullName = document.getElementById('fullName');
	let email = document.getElementById('email');
	let password = document.getElementById('password');
	let userUid = document.getElementById('uid');
	const docSnap = await getDoc(docRef);

	if (docSnap.exists()) {
		console.log('Document data:', docSnap.data());
		if (location.pathname === '/profile.html') {
			fullName.value = docSnap.data().fullName;
			email.value = docSnap.data().email;
			password.value = docSnap.data().Password;
			userUid.value = uid;
			console.log(uid);
			hideLoader();
		} else {
			let fullName = document.getElementById('fullName');
			fullName.innerHTML = docSnap.data().fullName;
		}
		hideLoader();
	} else {
		// docSnap.data() will be undefined in this case
		console.log('No such document!');
		hideLoader();
	}
};

function handleSubmission() {
	const titleInput = document.getElementById("title");
	const contentInput = document.getElementById("content");
	const dashboard = document.getElementById("dashboardPreview");
	const imgInput = document.getElementById("image");
  
	const title = titleInput.value;
	const content = contentInput.value;
	const imageFile = imgInput.files[0];
  
	if (title && content) {
	  saveToLocalStorage(title, content, imageFile);
	  titleInput.value = "";
	  contentInput.value = "";
	  imgInput.value = "";
	  loadFromLocalStorage(dashboard);
	}
}

// get all blogs

const getALlBlogs = async () => {
	const blogArea = document.getElementById('AllBlogsContainer');
	const querySnapshot = await getDocs(collection(db, 'blogs'));
	querySnapshot.forEach((doc) => {
		blogArea.innerHTML += `
    <div class="mt-2 mb-2">
        <div class="head-blog mt-2">
            <div class="card border border-secondary-subtle rounded py-2">
                <div class="card-header d-flex gap-4">
                    <img class="blog-avatar m-0"
                        src="${doc.data().user.profile ? doc.data().user.profile : 'asset/user-circle.jpg'}"
                        alt="">
                    <span class="d-flex flex-column justify-content-end">
                        <h5 class="card-title mb-3">${doc.data().user.fullName}</h5>
                        <h6 class="card-subtitle text-body-secondary">
                            ${doc.data().timestamp.toDate().toDateString()}
                        </h6>
                    </span>
                </div>
                <div class="card-body">
                    <h5 class="card-title mb-3">${doc.data().title}</h5>
                    <p class="card-text"> ${doc.data().description}</p>
                </div>
                <div class="card-body">
				<a href="user.html?user=${doc.data().uid}" class="card-link seeAll" >
                    View All Blogs
                </a></div>
            </div>
        </div>
    </div>
`;

	});
};

// read user blog

const getCurrentUserBlogs = async (uid) => {
	const blogArea = document.getElementById('my-blogs');
	const q = query(collection(db, 'blogs'), where('uid', '==', uid));

	const querySnapshot = await getDocs(q);
	blogArea.innerHTML = '';
	querySnapshot.forEach((doc) => {
		blogArea.innerHTML += `
				<div class="mt-2 mb-2">
				<div class="head-blog mt-2">
					<div class="card border border-secondary-subtle rounded py-2">
						<div class="card-header d-flex gap-4">
						   <img class="blog-avatar m-0"
                            src="${doc.data().user.profile ? doc.data().user.profile : 'asset/user-circle.jpg'}"
                            alt="">
							<span class="d-flex flex-column justify-content-end">
								<h5 class="card-title mb-3">${doc.data().user.fullName}</h5>
								<h6 class="card-subtitle text-body-secondary">
							 ${doc.data().timestamp.toDate().toDateString()}</h6>
							  
								
								
							</span>
						</div>
						<div class="card-body">
						<h5 class="card-title mb-3">${doc.data().title}</h5>
							<p class="card-text"> ${doc.data().description}</p>
						   <a href="javascript:void(0)" class="card-link seeAll" onclick="deleteBlog('${doc.id}')">Delete</a>
                        <a href="javascript:void(0)" class="card-link seeAll" onclick="editBlog('${doc.id}','${
			doc.data().title
		}','${doc.data().description}')">Edit</a>
		</div>
						</div>
					</div>
				</div>
			</div>
			 `;
	});
};

//isko dkh k krna bhi.. 
// onAuthStateChanged(auth, (user) => {
// 	if (user) {
// 		getuser(user.uid);
// 		if (location.pathname === '/blog.html') {
// 			getCurrentUserBlogs(user.uid);
// 		}  if (location.pathname === '/allblog.html') {
// 			getALlBlogs();
// 		}

// 		if (
// 			location.pathname !== '/blog.html' &&
// 			location.pathname !== '/blog.html' &&
// 			location.pathname !== '/user.html' &&
			
// 			location.pathname !== '/allblog.html' &&
// 			flag &&
// 			location.pathname !== '/profile.html'
// 		) {
// 			location.href = 'blog.html';
// 		}

// 		// ...
// 	} else {
// 		if (location.pathname !== '/start.html' && location.pathname !== '/signup.html' ) {
// 			location.href = '/start.html';
// 		}
// 	}
// });

//  Check user is logged in or not
	onAuthStateChanged(auth, (user) => {
	if (user) {
		getuser(user.uid);
		console.log(user);
		console.log("Auth is checking status!!");
		console.log("pathName:",location.pathname);
		if (location.pathname !== '/blog.html' && flag && location.pathname !== '/profile.html') {
			location.href = '/blog.html';
		}
	} else {
		console.log('user logout hogya');
		if (location.pathname !== '/index.html' && location.pathname !== '/blog.html') {
			location.href = '/index.html';
		}
	}
});

// Loader
const spiner = document.getElementById('spiner');
function showLoader() {
	spiner.style.display = 'flex';
}
function hideLoader() {
	spiner.style.display = 'none';
}

// Sign  Up Button
	const userNameElement = document.getElementById('userName');
	const userEmailElement = document.getElementById('userEmail');
	const signupBtn = document.getElementById('signupBtn');
const signup = () => {
	let fullName = document.getElementById('fullName');
	let Password = document.getElementById('passwordSignUp');
	let email = document.getElementById('emailSignUp');

	const user = {
		fullName: fullName.value,
		email: email.value,
		Password: Password.value,
	};
	if (!user.fullName || !user.email || !user.Password) {
		Swal.fire('Please fill out  all fields');
		return;
	}
	flag = false;

	createUserWithEmailAndPassword(auth, user.email, user.Password)
		.then(async (res) => {
			const user = res.user;
			showLoader();
			console.log(user);
			await setDoc(doc(db, 'UsersSignUp', user.uid), {
				fullName: fullName.value,
				email: email.value,
				Password: Password.value,
				uid: user.uid,
			});
			Swal.fire({
				position: 'center',
				icon: 'success',
				title: 'User has been created',
				showConfirmButton: false,
				timer: 1500,
			});

			hideLoader();
			setTimeout(() => {
				flag = true;
				location.href = "./blog.html";
			}, 2000);
		})
		.catch((error) => {
			const errorCode = error.code;
			const errorMessage = error.message;
			let errorText = errorMessage;
			switch (errorMessage) {
				case 'Firebase: Error (auth/invalid-email).':
					errorText = 'Invalid Email';
					break;
				case 'Firebase: Error (auth/email-already-in-use).':
					errorText = 'This email is already in use. Try different';
					break;
				default:
					errorText = errorText;
			}
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: errorText,
			});
			hideLoader();
		});
};
signupBtn && signupBtn.addEventListener('click', signup);

// Sign IN
const signinBtn = document.getElementById('signInBtn');
const signIn = () => {
	let email = document.getElementById('email');
	let password = document.getElementById('password');
	if ((!email.value, !password.value)) {
		Swal.fire('Please fill out  all fields');
		return;
	}
	showLoader();
	signInWithEmailAndPassword(auth, email.value, password.value)
		.then((res) => {
			const user = res.user;
			console.log(user);
			hideLoader();
			Swal.fire({
				position: 'center',
				icon: 'success',
				title: 'Loggined In',
				showConfirmButton: false,
				timer: 1500,
			});
			hideLoader();
			setTimeout(() => {
				flag = true;
				location.href = '/blog.html';
			}, 2000);
		})
		.catch((error) => {
			const errorCode = error.code;
			const errorMessage = error.message;
			hideLoader();
			let errorText = errorMessage;
			switch (errorMessage) {
				case 'Firebase: Error (auth/wrong-password).':
					errorText = 'Invalid Password';
					break;
				case 'Firebase: Error (auth/user-not-found).':
					errorText = 'Email is not correct';
					break;
				default:
					errorText = 'Something went wrong';
			}
				hideLoader();
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: errorText,
			});
		});
};
signinBtn && signinBtn.addEventListener('click', signIn);

// Sign Out
const logoutBtn = document.getElementById('Logout');
const signoutUser = () => {
	signOut(auth)
		.then(() => {
			// Sign-out successful.
			hideLoader();
			location.href = "./index.html";
		})
		.catch((error) => {
			// An error happened.
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: errorText,
			});
		});
};
// signOutBtn.addEventListener('click',userSignOut);
logoutBtn && logoutBtn.addEventListener('click', signoutUser);

//new update data by miss 
// update data
const updateBtn = document.getElementById('updateBtn');
let fileInput = document.getElementById('fileInput');

const updateUser = async () => {
	showLoader()
	console.log('yes user milgaya');
};
const uploadFile = (file) => {
	return new Promise((resolve, reject) => {
		const mountainImagesRef = ref(storage, `images/${file}`);
		const uploadTask = uploadBytesResumable(mountainImagesRef, file);
		uploadTask.on(
			'state_changed',
			(snapshot) => {
				const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				console.log('Upload is ' + progress + ' % done');
				switch (snapshot.state) {
					case 'paused':
						console.log('Upload is  paused');
						break;
					case 'running':
						console.log('Upload is running');
						break;
				}
			},
			(error) => {
				reject(error);
			},
			() => {
				getDownloadURL(uploadTask.snapshot.ref).then((downloadRef) => {
					resolve(downloadRef);
				});
			},
		);
	});
};

updateBtn && updateBtn.addEventListener('click', updateUser);

// camera icon
fileInput &&
	fileInput.addEventListener('change', (e) => {
		profilePicture.src = URL.createObjectURL(e.target.files[0]);
	});

// Blog Post

const postBlog = document.getElementById('postBlog');
const submitBlog = async () => {
	let title = document.getElementById('title');
	let textarea = document.getElementById('textarea');
	const currentUser = auth.currentUser;
	showLoader();
	const userRef = doc(db, 'users', currentUser.uid);

	const userData = await getDoc(userRef);
	console.log('User Data', userData.data());
	const docRef = await addDoc(collection(db, 'blogs'), {
		title: title.value,
		description: textarea.value,
		timestamp: serverTimestamp(),
		uid: currentUser.uid,
		user: userData.data(),
	});

	// console.log('Document written with ID: ', docRef.id);
	hideLoader();
	Swal.fire('Blog', 'Blog published', 'success');
	getCurrentUserBlogs(currentUser.uid);
	title.value = '';
	textarea.value = '';
};

postBlog && postBlog.addEventListener('click', submitBlog);

// Delete Blogs

const deleteBlog = async (id) => {
	showLoader();
	await deleteDoc(doc(db, 'blogs', id));
	hideLoader();
	Swal.fire('Blog', 'Blog Deleted', 'success');

	const currentUser = auth.currentUser;
	getCurrentUserBlogs(currentUser.uid);
};

// edit Blog

const updateModal = document.getElementById('updateMOdal');
const updatetitle = document.getElementById('update-title');
const updateTextArea = document.getElementById('update-textarea');
let updateId = '';

const editBlog = (id, title, description) => {
	updateId = id;
	updatetitle.value = title;
	updateTextArea.value = description;
	updateModal.style.display = 'block';
	console.log(updateId, updatetitle.value, updateTextArea.value);
};

// cancel Blog
const cancelBtn = document.getElementById('cancel');

const cancelFunc = () => {
	updateModal.style.display = 'none';
};

cancelBtn && cancelBtn.addEventListener('click', cancelFunc);

const updateBlog = document.getElementById('update-Blog');

updateBlog &&
	updateBlog.addEventListener('click', async () => {
		const currentUser = auth.currentUser;

		showLoader();
		const washingtonRef = doc(db, 'blogs', updateId);

		await updateDoc(washingtonRef, {
			title: updatetitle.value,
			description: updateTextArea.value,
		});
		hideLoader();
		updatetitle.value = '';
		updateTextArea.value = '';
		getCurrentUserBlogs(currentUser.uid);
		cancelFunc();

		Swal.fire('Blog', 'Blog Updated', 'success');
	});

const getUserBlogs = async() => {
	const urlParams = new URLSearchParams(location.search);
	const user = urlParams.get("user")
	const blogArea = document.getElementById('user-blog-add');
	const profileArea = document.getElementById("profile");

const userRef = doc(db, 'users', user);

const userData = await getDoc(userRef);
console.log("userData",userData.data());
  profileArea.innerHTML = `
		<div class="card">
            <img width="10px"
                src="${	userData.data().profile && userData.data().profile !== 'undefined'	? userData.data().profile : 'asset/user-circle.jpg'}"
                class="card-img-top" >
            <div class="card-body">
                <h5 class="card-title">${userData.data().fullName}</h5>
                <p class="email">${userData.data().email}</p>
            </div>
        </div>  `;

	const q = query(collection(db, 'blogs'), where('uid', '==', user));

	const querySnapshot = await getDocs(q);
	blogArea.innerHTML = '';
	querySnapshot.forEach((doc) => {
		blogArea.innerHTML += `
			<div class="mt-2 mb-2">
				<div class="head-blog mt-2">
					<div class="card border border-secondary-subtle rounded py-2">
						<div class="card-header d-flex gap-4">
						   <img class="blog-avatar m-0"
                            src="${doc.data().user.profile ? doc.data().user.profile : 'asset/user-circle.jpg'}">
							<span class="d-flex flex-column justify-content-end">
								<h5 class="card-title mb-3">${doc.data().user.fullName}</h5>
								<h6 class="card-subtitle text-body-secondary">
							 ${doc.data().timestamp.toDate().toDateString()}</h6>
							</span>
						</div>
						<div class="card-body">
						<h5 class="card-title mb-3">${doc.data().title}</h5>
							<p class="card-text"> ${doc.data().description}</p></div>
						</div>
					</div>
			  </div>
		  </div> `;
	});
}
if (location.pathname === "/allblog.html") {
		getUserBlogs()
	}
window.deleteBlog = deleteBlog;

window.editBlog = editBlog;



