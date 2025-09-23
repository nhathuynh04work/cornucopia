function ProfileEdit() {
	return (
		<div className="py-6 w-3/4 mx-auto">
			<form>
				<label htmlFor="">Name</label>
				<input type="text" />

				<label htmlFor="">Email</label>
				<input type="text" />

				<label htmlFor="">Avatar</label>
				<input type="text" />
			</form>
		</div>
	);
}

export default ProfileEdit;
