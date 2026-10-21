const Inquiry = require('../models/Inquiry');
const { isDatabaseConnected } = require('../config/db');

/**
 * POST /api/contact
 * Handle customer inquiry submission
 */
exports.submitInquiry = async (req, res, next) => {
  try {
    const { name, phone, email, subject, message } = req.body;

    // Request Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Full name is required and must contain at least 2 characters.'
        }
      });
    }

    if (!phone || typeof phone !== 'string' || !/^[0-9]{10}$/.test(phone.replace(/[\s-]/g, ''))) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'A valid 10-digit mobile number is required.'
        }
      });
    }

    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Please provide a message with at least 5 characters.'
        }
      });
    }

    // Save to database if connected
    if (isDatabaseConnected()) {
      await Inquiry.create({
        name: name.trim(),
        phone: phone.trim(),
        email: email ? email.trim() : '',
        subject: subject || 'Store Sizing / Product Inquiry',
        message: message.trim()
      });
    } else {
      console.log(`[Contact Inquiry Demo Received] Name: ${name}, Phone: ${phone}, Message: ${message}`);
    }

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been received by MR SM Multi Brand Store. We will call you shortly.'
    });
  } catch (err) {
    next(err);
  }
};
