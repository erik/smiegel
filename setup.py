from setuptools import setup

setup(
    name='smiegel',
    version='0.0',
    long_description=__doc__,
    packages=['smiegel'],
    include_package_data=True,
    author='Erik Price',
    description='Self hosted SMS mirroring service',
    license='MIT',
    install_requires=open('requirements.txt').readlines(),
    entry_points={
        'console_scripts': [
            'smiegel = smiegel.__main__:main'
        ],
}
)
