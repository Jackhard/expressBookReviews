const express = require('express')
let books = require('./booksdb.js')
let isValid = require('./auth_users.js').isValid
let users = require('./auth_users.js').users
const public_users = express.Router()
const jwt = require('jsonwebtoken')
const session = require('express-session')
const regd_users = express.Router()
const axios = require('axios')
const authenticatedUser = require('./auth_users.js').authenticatedUser
const doesExist = require('./auth_users.js').doesExist

let user = []


public_users.use(
	session({secret: 'fingerprint', resave : true, saveUninitialized : true})
)


/////////////////////////////////////
public_users.post("/register", (req,res) => {
  //Write your code here
//////////////////////////////////////
	const username = req.body.username;
	const password = req.body.password;
	
	if (username && password) {
		if (!doesExist(username)) {
			user.push ({"username":username, "password":password});
			return res.status(200).json({message: "User " + username+" successfully registred. Now you can login" });
		} else {
			return res.status(404).json({message: "User " + username + " already exists!"});
		}
	}
	return res.status(404).json({message: "Unable to register user."});
});
/////////////////////////////////  



///////////////////////////////////////////
const listBooks = async () => {
	try{
		const getBooksPromise = await Prolise.resolve (books)
		if (getBooksPromise) {
			return getBooksPromise
		} else {
			return Promise.reject (new error('Books not found'))
		}
	} catch (error) {
		console.log (error)
	}
}
//////////////////////////////////////////

// Get the book list available in the shop
public_users.get('/',async (req, res)=> {
  //Write your code here
  ////////////////////////////
  const listBook = await listBooks()
  res.json (listBook)
});
///////////////////////////


/////////////////////////////////////////
	const getBooksIsbn = async isbn => {
		try {
			const getIsbnPromise = await promise.resolve (isbn)
			if (getIsbnPromise){
				return promise.resolve (isbn)
			} else {
				return promise.reject (new error('ISBN not found.'))				
			}
		} catch (error) {
			console.log (error)
		}
	}
////////////////////////////////////

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async (req, res) => {
  //Write your code here
//////////////////////////////
	const isbn = req.params.isbn;
	const retIsbn = await getBooksIsbn(isbn)
	res.send (books[retIsbn])
 });
 //////////////////////////////
 
 
 
 ////////////////////////////////////// 
// Get book details based on author

const findAuthor = async author => {
	try {
		if (author) {
			const AuthBook = []
			Object.values(books).map(book => {
				if (book.author === author) {
					AuthBook.push(book)
				}
			})
			return Promise.resolve(AuthBook)
		} else {
			return Promise.reject(
				new Error('Could not retrieve Author Promise.')
			)
		}
	} catch (error) {
		console.log(error)
	}
}
//////////////////////////////////

////////////////////////////////////
public_users.get('/author/:author', async (req, res) => {
	const author = req.params.author
	const data = await findAuthor(author)
	res.send(data)
})
////////////////////////////////



////////////////////////////////
// Get all books based on title

const findTitle = async title => {
	try {
		if (title) {
			const TitleBook = []
			Object.values(books).map(book => {
				if (book.title === title) {
					TitleBook.push(book)
				}
			})
			return Promise.resolve(TitleBook)
		} else {
			return Promise.reject(
				new Error('Could not retrieve Title Promise.')
			)
		}
	} catch (error) {
		console.log(error)
	}
}
///////////////////////////////////

//////////////////////////////////
public_users.get('/title/:title', async (req, res) => {
	const title = req.params.title
	const data = await findTitle(title)
	res.send(data)
})
///////////////////////////////////


/////////////////////////////////////
//  Get book review
public_users.get('/review/:isbn',async (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
	//let book = books[isbn]
	let book = books[isbn];
	if (book){
		let reviews = await book["reviews"];
	res.send (book.reviews);
	}
});
///////////////////////////////////////////



////////////////////////////////////////////
public_users.post("/login", (req,res) => {
  //Write your code here
////////////////////////////
	const username = req.body.username;
	const password = req.body.password;
	
	if (!username || !password) {
		return res.status(404).json({message: "Error log in."});
	}
	
	if (authenticatedUser(username, password)){
		let accessToken = jwt.sign ({
			data: password
		}, 'access', {expiresIn: 60 * 60});
		
		req.session.authorizition = {
			accessToken, username
		}
		return res.status(200).send("User " + username + " successfully logged in");
	} else {
		return res.status(208).json({message: "Invalid Login2. Check username and password"});
	}
});
/////////////////////////////////  



//////////////////////////////////////
public_users.put("/auth/review/:isbn", async (req, res) => {
	
  
  const isbn = req.params.isbn;
  let filtered_book = books[isbn]
  if (filtered_book) {
      let review = req.query.review;
      let reviewer = ['username'];
      if(review) {
          filtered_book['reviews'][reviewer] = review;
          books[isbn] = await filtered_book;
      }
      res.send(`The review for the book with ISBN  ${isbn} has been added/updated.`);
  }
  else{
      res.send("Unable to find this ISBN!");
  }
});
//////////////////////////////



module.exports.general = public_users;
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;