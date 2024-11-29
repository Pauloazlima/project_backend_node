const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

// Estratégia de Registro
passport.use(
  'register',
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password', passReqToCallback: true },
    async (req, email, password, done) => {
      try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return done(null, false, { message: 'Usuário já existe' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword, name: req.body.name });
        await newUser.save();
        done(null, newUser);
      } catch (error) {
        done(error);
      }
    }
  )
);

// Estratégia de Login
passport.use(
  'login',
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) return done(null, false, { message: 'Usuário não encontrado' });

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) return done(null, false, { message: 'Senha incorreta' });

        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

// Estratégia GitHub
passport.use(
  new GitHubStrategy(
    {
      clientID: 'Ov23li9JBwNZh4G6BkwW', // Substitua pelo seu Client ID
      clientSecret: '95f5387aa979480b62533125c1b91cb38317c20f', // Substitua pelo seu Client Secret
      callbackURL: 'http://localhost:8080/auth/github/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ githubId: profile.id });
        if (!user) {
          user = new User({
            githubId: profile.id,
            name: profile.displayName || 'GitHub User',
            email: profile.emails[0].value,
          });
          await user.save();
        }
        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

// Serialização
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Desserialização
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

module.exports = passport;
