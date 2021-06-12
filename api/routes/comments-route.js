const express = require('express');
const router = express.Router();
const { Comment } = require("../models/comments-model");

router.post("/saveComment", (req, res) => {

    const comment = new Comment(req.body)

    comment.save((err, comment) => {
        if (err) return res.json({success: false, err})
        Comment.find({'_id': comment._id})
            .populate('writer')
            .exec((err, result) => {
                if (err) return res.json({success: false, err})
                return res.status(200).json({success: true, result})
            })

    })
 });

router.post("/getComments", (req, res) => {

    Comment.find({ "postId": req.body.postId })
        .populate('writer')
        .exec((err, comments) => {
            if (err) return res.status(400).send(err)
            res.status(200).json({ success: true, comments })
        })

});

/*Article delete*/
router.delete('/deleteComment/:id', async function (req, res) {
    let cond = {_id: req.params.id};
    let removeComment = await Comment.findOneAndDelete(cond)
        .then(() => res.send(200, "Article deleted."))
        .catch(() => res.send(500, "Failed to delete the article."));
    console.log(removeComment);
})




module.exports = router;
