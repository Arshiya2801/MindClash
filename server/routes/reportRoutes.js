import express from 'express';
import Report from '../models/Report.js';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/reports
 * @desc    Submit a new report
 * @access  Private
 */
router.post('/', protect, async (req, res) => {
    try {
        const { reportType, reportedUser, reportedDebate, reportedCommunity, reason, description } = req.body;

        const validTypes = ['user', 'message', 'debate', 'community'];
        if (!validTypes.includes(reportType)) {
            return res.status(400).json({ success: false, message: 'Invalid report type' });
        }

        const validReasons = ['harassment', 'hate_speech', 'spam', 'misinformation', 'inappropriate_content', 'cheating', 'impersonation', 'other'];
        if (!validReasons.includes(reason)) {
            return res.status(400).json({ success: false, message: 'Invalid reason' });
        }

        // Prevent duplicate reports within 24 hours
        const existingReport = await Report.findOne({
            reporter: req.user._id,
            reportedUser: reportedUser || undefined,
            reportedDebate: reportedDebate || undefined,
            createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        });

        if (existingReport) {
            return res.status(429).json({
                success: false,
                message: 'You already reported this recently. Please wait 24 hours.',
            });
        }

        const report = await Report.create({
            reporter: req.user._id,
            reportType,
            reportedUser:      reportedUser      || undefined,
            reportedDebate:    reportedDebate    || undefined,
            reportedCommunity: reportedCommunity || undefined,
            reason,
            description: description?.slice(0, 1000),
        });

        res.status(201).json({
            success: true,
            message: 'Report submitted. Our team will review it shortly.',
            reportId: report._id,
        });
    } catch (error) {
        console.error('Submit report error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

/**
 * @route   GET /api/reports/my
 * @desc    Get user's own submitted reports
 * @access  Private
 */
router.get('/my', protect, async (req, res) => {
    try {
        const reports = await Report.find({ reporter: req.user._id })
            .sort({ createdAt: -1 })
            .limit(20)
            .select('reportType reason status createdAt');

        res.json({ success: true, reports });
    } catch (error) {
        console.error('Get my reports error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;
