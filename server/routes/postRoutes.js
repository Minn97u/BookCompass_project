const express = require('express');
const router = express.Router();
const Post = require('../models/postSchema');
const User = require('../models/userSchema'); // User 모델 가져오기
const commentRoutes = require('./commentRoutes'); // 댓글 라우트 추가
const { ensureAuthenticated } = require('../middlewares/checklogin');

// 게시글 생성
router.post('/', ensureAuthenticated, async (req, res) => {
    const { title, content, tag } = req.body;

    if (!title || !content) {
        return res.status(400).json({ msg: 'Title and content are required' });
    }

    try {
        const newPost = new Post({
            title,
            content,
            tag,
            author: req.user._id,
        });

        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// 게시글 목록 불러오기
router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1; // 페이지 번호, 기본값 1
    const limit = parseInt(req.query.limit) || 10; // 페이지당 항목 수, 기본값 10

    try {
        const posts = await Post.find()
            .populate('author', 'name profilePic') // 작성자 이름과 프로필 사진을 가져오기 위해 populate 사용
            .sort({ createdAt: -1 }) // 새롭게 작성된 글부터 정렬
            .select('shortId title tag author createdAt updatedAt') // shortId, 제목, 태그, 작성자 이름, 생성 및 수정 시간 선택
            .skip((page - 1) * limit) // 건너뛸 문서 수
            .limit(limit) // 가져올 문서 수
            .lean(); // lean 메서드를 사용하여 일반 자바스크립트 객체로 변환

        // 작성자 이름만 포함하는 형태로 변환
        const transformedPosts = posts.map(post => ({
            shortId: post.shortId,
            title: post.title,
            tag: post.tag,
            author: {
                name: post.author.name,
                profilePic: post.author.profilePic
            },
            createdAt: post.createdAt,
            updatedAt: post.updatedAt
        }));

        // 전체 게시글 수를 계산하여 페이지네이션 정보 포함
        const totalPosts = await Post.countDocuments();
        const totalPages = Math.ceil(totalPosts / limit);

        res.status(200).json({
            currentPage: page,
            totalPages: totalPages,
            posts: transformedPosts
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// 게시물 상세 정보 불러오기
router.get('/:shortId', async (req, res) => {
    const { shortId } = req.params;

    try {
        const post = await Post.findOne({ shortId })
            .populate('author', 'name profilePic') // 작성자의 이름과 프로필 사진을 가져오기 위해 populate 사용
            .lean();

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        const detailedPost = {
            shortId: post.shortId,
            title: post.title,
            content: post.content,
            tag: post.tag,
            author: {
                name: post.author.name,
                profilePic: post.author.profilePic
            },
            createdAt: post.createdAt,
            updatedAt: post.updatedAt
        };

        res.status(200).json(detailedPost);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// 게시글 수정
router.put('/:shortId', ensureAuthenticated, async (req, res) => {
    const { shortId } = req.params;
    const { title, content, tag } = req.body;

    if (!title || !content) {
        return res.status(400).json({ msg: 'Title and content are required' });
    }

    try {
        const post = await Post.findOne({ shortId });

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        // 작성자와 현재 로그인한 사용자가 동일한지 확인
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ msg: 'You are not authorized to edit this post' });
        }

        // 게시글 수정
        post.title = title;
        post.content = content;
        post.tag = tag;
        post.updatedAt = Date.now(); // 수정한 시간 기록

        const updatedPost = await post.save();
        res.status(200).json(updatedPost);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// 게시글 삭제
router.delete('/:shortId', ensureAuthenticated, async (req, res) => {
    const { shortId } = req.params;

    try {
        const post = await Post.findOne({ shortId });

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        // 작성자와 현재 로그인한 사용자가 동일한지 확인
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ msg: 'You are not authorized to delete this post' });
        }

        await Post.deleteOne({ shortId });
        res.status(200).json({ msg: 'Post deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// 댓글 라우트 포함
router.use('/:postId/comments', commentRoutes);

module.exports = router;