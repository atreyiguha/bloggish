var express= require("express");
var router= express.Router();
var Campground=require("../models/campground");
var middleware=require("../middleware");


router.get("/",function(req,res){
	
	Campground.find({},function(err,allCampgrounds){
		if(err){
			console.log(err);
		}
		else{
			console.log("No ERROR");
			res.render("campgrounds/index",{campgrounds: allCampgrounds});
		}
	});
});

router.post("/",middleware.isLoggedIn,function(req,res){
	
	//get data from form and add to campgrounds array
	var name=req.body.name;
	var date=req.body.price;
	var image=req.body.image;
	var dsc=req.body.description;
	var author={
		id: req.user._id,
		username: req.user.username
	}
	var newCampground={name:name ,price : date , image:image , description: dsc , author: author};
	
	Campground.create(newCampground,function(err,newlyCreated){
		if(err)
			{
				console.log(err);
			}else{
				console.log(newlyCreated);
				res.redirect("/campgrounds");
			}
	});
	//redirect back to campground page
	
	
});

router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("campgrounds/new");
});



router.get("/:id",function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
		if(err){
			console.log(err);
		}else{
			console.log(foundCampground);
			res.render("campgrounds/show",{campground:foundCampground});
		}
	});
	
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
	
		Campground.findById(req.params.id,function(err, foundCampground){
		
			
				res.render("campgrounds/edit",{campground: foundCampground});
			
			
				
	});	
});
//UPDATE CAMPGROUND ROUTE
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});


//DESTROY CAMPGROUND ROUTE
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds");
		}
	})
});


//middleware



module.exports = router;
